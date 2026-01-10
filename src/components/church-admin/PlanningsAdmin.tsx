import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar, Users, CheckCircle, Clock, List, CalendarDays } from 'lucide-react';
import { supabase, Planning, PlanningAssignment, ServiceMember, PlanningStatus, Service, Profile } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface MemberWithProfile extends ServiceMember {
  profile?: Profile;
}

interface PlanningWithAssignments extends Planning {
  assignments?: (PlanningAssignment & { member?: ServiceMember; profile?: Profile })[];
}

export const PlanningsAdmin: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [plannings, setPlannings] = useState<PlanningWithAssignments[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; planningId: string | null }>({ 
    isOpen: false, 
    planningId: null 
  });

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarStartDate, setCalendarStartDate] = useState<Date>(new Date());
  const [quickPlanningModal, setQuickPlanningModal] = useState<{
    isOpen: boolean;
    date: string;
    memberId: string;
    planning?: PlanningWithAssignments;
  }>({ isOpen: false, date: '', memberId: '' });
  const [quickFormData, setQuickFormData] = useState<{
    task: string;
    status: PlanningStatus;
    notes: string;
  }>({ task: '', status: 'planned', notes: '' });

  const statusOptions: { value: PlanningStatus; label: string; color: string }[] = [
    { value: 'planned', label: 'Planifié', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      fetchPlannings(selectedServiceId);
      fetchMembers(selectedServiceId);
    }
  }, [selectedServiceId]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setServices(data || []);
      if (data && data.length > 0 && !selectedServiceId) {
        setSelectedServiceId(data[0].id);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des services');
    }
  };


  const fetchMembers = async (serviceId: string) => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from('service_members')
        .select('*')
        .eq('service_id', serviceId)
        .eq('status', 'active');

      if (membersError) throw membersError;

      const membersWithProfiles = await Promise.all(
        (membersData || []).map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', member.user_id)
            .single();

          return { ...member, profile };
        })
      );

      setMembers(membersWithProfiles);
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des membres');
    }
  };

  const fetchPlannings = async (serviceId: string) => {
    try {
      setLoading(true);
      const { data: planningsData, error: planningsError } = await supabase
        .from('plannings')
        .select('*')
        .eq('service_id', serviceId)
        .order('date', { ascending: false });

      if (planningsError) throw planningsError;

      const planningsWithAssignments = await Promise.all(
        (planningsData || []).map(async (planning) => {
          const { data: assignments, error: assignmentsError } = await supabase
            .from('planning_assignments')
            .select('*')
            .eq('planning_id', planning.id);

          if (assignmentsError) {
            console.error('Erreur assignments:', assignmentsError);
            return { ...planning, assignments: [] };
          }

          const assignmentsWithMembers = await Promise.all(
            (assignments || []).map(async (assignment) => {
              // assignment.member_id contient le user_id (UUID de auth.users)
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', assignment.member_id)
                .single();

              return { ...assignment, profile };
            })
          );

          return { ...planning, assignments: assignmentsWithMembers };
        })
      );

      setPlannings(planningsWithAssignments);
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des plannings');
    } finally {
      setLoading(false);
    }
  };


  const openQuickPlanningModal = (date: string, memberId: string, planning?: PlanningWithAssignments) => {
    console.log('Opening modal with planning:', planning);
    if (planning) {
      setQuickFormData({
        task: planning.task,
        status: planning.status,
        notes: planning.notes || '',
      });
    } else {
      setQuickFormData({ task: '', status: 'planned', notes: '' });
    }
    setQuickPlanningModal({ isOpen: true, date, memberId, planning });
  };

  const closeQuickPlanningModal = () => {
    setQuickPlanningModal({ isOpen: false, date: '', memberId: '' });
    setQuickFormData({ task: '', status: 'planned', notes: '' });
  };

  const handleQuickSave = async () => {
    try {
      if (!quickFormData.task) {
        showWarning('La tâche est requise');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const member = members.find(m => m.id === quickPlanningModal.memberId);

      if (!member) {
        showError('Membre introuvable');
        return;
      }

      const dataToSave = {
        service_id: selectedServiceId,
        date: quickPlanningModal.date,
        task: quickFormData.task,
        status: quickFormData.status,
        notes: quickFormData.notes || null,
        created_by: user?.id || null,
        updated_at: new Date().toISOString(),
      };

      let planningId: string;

      if (quickPlanningModal.planning) {
        const { error } = await supabase
          .from('plannings')
          .update(dataToSave)
          .eq('id', quickPlanningModal.planning.id);

        if (error) throw error;
        planningId = quickPlanningModal.planning.id;

        const { error: deleteError } = await supabase
          .from('planning_assignments')
          .delete()
          .eq('planning_id', planningId);

        if (deleteError) throw deleteError;
      } else {
        const { data, error } = await supabase
          .from('plannings')
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;
        planningId = data.id;
      }

      const { error: assignError } = await supabase
        .from('planning_assignments')
        .insert([{
          planning_id: planningId,
          member_id: member.user_id,
          individual_status: 'planned' as PlanningStatus,
        }]);

      if (assignError) throw assignError;

      await fetchPlannings(selectedServiceId);
      closeQuickPlanningModal();
      showSuccess('Planning enregistré avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de l\'enregistrement');
    }
  };

  const handleQuickDelete = async () => {
    if (!quickPlanningModal.planning) return;

    try {
      const { error: assignError } = await supabase
        .from('planning_assignments')
        .delete()
        .eq('planning_id', quickPlanningModal.planning.id);

      if (assignError) throw assignError;

      const { error } = await supabase
        .from('plannings')
        .delete()
        .eq('id', quickPlanningModal.planning.id);

      if (error) throw error;
      
      await fetchPlannings(selectedServiceId);
      closeQuickPlanningModal();
      showSuccess('Planning supprimé avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la suppression');
    }
  };


  const handleDelete = async (id: string) => {
    setDeleteConfirm({ isOpen: true, planningId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.planningId) return;

    try {
      const { error: assignError } = await supabase
        .from('planning_assignments')
        .delete()
        .eq('planning_id', deleteConfirm.planningId);

      if (assignError) throw assignError;

      const { error } = await supabase
        .from('plannings')
        .delete()
        .eq('id', deleteConfirm.planningId);

      if (error) throw error;
      await fetchPlannings(selectedServiceId);
      showSuccess('Planning supprimé avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la suppression');
    } finally {
      setDeleteConfirm({ isOpen: false, planningId: null });
    }
  };


  if (loading && !selectedServiceId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Gestion des plannings</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                selectedServiceId === service.id
                  ? 'border-teal-500 bg-teal-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-teal-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{service.emoji}</div>
                <div className="text-sm font-medium text-gray-900">{service.display_name}</div>
                {service.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedServiceId && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {plannings.length} planning(s) pour ce service
            </p>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={16} />
                <span className="text-sm font-medium">Liste</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarDays size={16} />
                <span className="text-sm font-medium">Calendrier</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'calendar' && selectedServiceId && (() => {
        const getWeekDates = (startDate: Date) => {
          const dates = [];
          const start = new Date(startDate);
          start.setDate(start.getDate() - start.getDay() + 1);
          
          for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
          }
          return dates;
        };

        const weekDates = getWeekDates(calendarStartDate);
        const allDates = plannings.length > 0 
          ? Array.from(new Set([...plannings.map(p => p.date), ...weekDates])).sort()
          : weekDates;

        const goToPreviousWeek = () => {
          const newDate = new Date(calendarStartDate);
          newDate.setDate(newDate.getDate() - 7);
          setCalendarStartDate(newDate);
        };

        const goToNextWeek = () => {
          const newDate = new Date(calendarStartDate);
          newDate.setDate(newDate.getDate() + 7);
          setCalendarStartDate(newDate);
        };

        const goToToday = () => {
          setCalendarStartDate(new Date());
        };

        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
              <button
                onClick={goToPreviousWeek}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Semaine précédente
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
              >
                Aujourd'hui
              </button>
              <button
                onClick={goToNextWeek}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Semaine suivante →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                        Membre
                      </th>
                      {allDates.map(date => {
                        const dateObj = new Date(date);
                        const isToday = date === new Date().toISOString().split('T')[0];
                        return (
                          <th key={date} className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider min-w-[150px] ${
                            isToday ? 'bg-teal-100 text-teal-900' : 'text-gray-500'
                          }`}>
                            <div>{dateObj.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                            <div className="font-semibold text-gray-900">
                              {dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {members.map(member => {
                      const memberPlannings = plannings.filter(p => 
                        p.assignments?.some(a => a.profile?.id === member.user_id)
                      );
                      
                      return (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white border-r z-10">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {member.profile?.full_name || 'Utilisateur inconnu'}
                                </div>
                                {member.profile?.email && (
                                  <div className="text-xs text-gray-500">{member.profile.email}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          {allDates.map(date => {
                            const planning = memberPlannings.find(p => p.date === date);
                            const statusOption = planning ? statusOptions.find(s => s.value === planning.status) : null;
                            const isToday = date === new Date().toISOString().split('T')[0];
                            
                            return (
                              <td key={date} className={`px-4 py-3 text-center ${
                                isToday ? 'bg-teal-50' : ''
                              }`}>
                                {planning ? (
                                  <div className="space-y-1">
                                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusOption?.color}`}>
                                      {statusOption?.label}
                                    </div>
                                    <div className="text-xs text-gray-700 font-medium">{planning.task}</div>
                                    <div className="flex justify-center space-x-1 mt-1">
                                      <button
                                        onClick={() => openQuickPlanningModal(date, member.id, planning)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Modifier"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => openQuickPlanningModal(date, member.id)}
                                    className="text-gray-400 hover:text-teal-600 hover:bg-teal-50 p-2 rounded transition-colors"
                                    title="Ajouter un planning"
                                  >
                                    <Plus size={16} />
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {members.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre</h3>
                  <p className="text-gray-600">Ajoutez des membres au service pour commencer à planifier</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {viewMode === 'list' && (() => {
        // Regrouper les plannings par date
        const planningsByDate = plannings.reduce((acc, planning) => {
          if (!acc[planning.date]) {
            acc[planning.date] = [];
          }
          acc[planning.date].push(planning);
          return acc;
        }, {} as Record<string, PlanningWithAssignments[]>);

        // Trier les dates par ordre décroissant
        const sortedDates = Object.keys(planningsByDate).sort((a, b) => 
          new Date(b).getTime() - new Date(a).getTime()
        );

        return (
          <div className="space-y-4">
            {sortedDates.map((date) => {
              const datePlannings = planningsByDate[date];
              
              return (
                <div key={date} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
                    <Calendar className="text-teal-600" size={20} />
                    <h3 className="font-semibold text-lg text-gray-900">
                      {new Date(date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {datePlannings.map((planning) => {
                      const statusOption = statusOptions.find(s => s.value === planning.status);
                      
                      return (
                        <div key={planning.id} className="border-l-4 border-teal-500 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="text-gray-900 font-medium">{planning.task}</p>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusOption?.color}`}>
                                  {statusOption?.label}
                                </span>
                              </div>
                              {planning.notes && (
                                <p className="text-sm text-gray-600 mb-2">{planning.notes}</p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  if (planning.assignments && planning.assignments.length > 0) {
                                    const firstAssignment = planning.assignments[0];
                                    const member = members.find(m => m.user_id === firstAssignment.member_id);
                                    if (member) {
                                      openQuickPlanningModal(planning.date, member.id, planning);
                                    }
                                  }
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="Modifier"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(planning.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {planning.assignments && planning.assignments.length > 0 && (
                            <div className="flex items-center flex-wrap gap-2 mt-2">
                              <Users size={14} className="text-gray-500" />
                              {planning.assignments.map((assignment) => (
                                <div
                                  key={assignment.id}
                                  className="flex items-center px-2 py-1 bg-gray-100 rounded text-xs"
                                >
                                  <CheckCircle className="text-teal-500 mr-1" size={12} />
                                  <span className="text-gray-700">
                                    {assignment.profile?.full_name || 'Utilisateur inconnu'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {viewMode === 'list' && plannings.length === 0 && !loading && selectedServiceId && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun planning</h3>
          <p className="text-gray-600">Commencez par créer votre premier planning</p>
        </div>
      )}

      {quickPlanningModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {quickPlanningModal.planning ? 'Modifier le planning' : 'Nouveau planning'}
              </h3>
              <button
                onClick={closeQuickPlanningModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Date:</strong> {new Date(quickPlanningModal.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Membre:</strong> {members.find(m => m.id === quickPlanningModal.memberId)?.profile?.full_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tâche *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => setQuickFormData({ ...quickFormData, task: 'Leader' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      quickFormData.task === 'Leader'
                        ? 'border-teal-500 bg-teal-50 text-teal-900 font-medium'
                        : 'border-gray-300 text-gray-700 hover:border-teal-300'
                    }`}
                  >
                    Leader
                  </button>
                  <button
                    onClick={() => setQuickFormData({ ...quickFormData, task: 'Participant' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      quickFormData.task === 'Participant'
                        ? 'border-teal-500 bg-teal-50 text-teal-900 font-medium'
                        : 'border-gray-300 text-gray-700 hover:border-teal-300'
                    }`}
                  >
                    Participant
                  </button>
                </div>
                <input
                  type="text"
                  value={quickFormData.task}
                  onChange={(e) => setQuickFormData({ ...quickFormData, task: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Ou saisir une tâche personnalisée..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={quickFormData.status}
                  onChange={(e) => setQuickFormData({ ...quickFormData, status: e.target.value as PlanningStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={quickFormData.notes}
                  onChange={(e) => setQuickFormData({ ...quickFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>

            <div className="flex justify-between p-6 border-t bg-gray-50">
              <div>
                {quickPlanningModal.planning && (
                  <button
                    onClick={handleQuickDelete}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={closeQuickPlanningModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleQuickSave}
                  className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                >
                  <Save size={18} />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Supprimer le planning"
        message="Êtes-vous sûr de vouloir supprimer ce planning ? Toutes les assignations seront également supprimées. Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, planningId: null })}
        type="danger"
      />
    </div>
  );
};
