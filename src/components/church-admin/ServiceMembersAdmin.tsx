import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Users, UserPlus, Search } from 'lucide-react';
import { supabase, ServiceMember, Service, Profile } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface MemberWithProfile extends ServiceMember {
  profile?: Profile;
}

export const ServiceMembersAdmin: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; memberId: string | null }>({ 
    isOpen: false, 
    memberId: null 
  });

  useEffect(() => {
    fetchServices();
    fetchAllProfiles();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      fetchMembers(selectedServiceId);
    }
  }, [selectedServiceId]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_name', { ascending: true });

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

  const fetchAllProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setAllProfiles(data || []);
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des profils');
    }
  };

  const fetchMembers = async (serviceId: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setIsAdding(true);
    setSelectedUserId('');
    setNotes('');
    setSearchTerm('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedUserId('');
    setNotes('');
    setSearchTerm('');
  };

  const handleSave = async () => {
    try {
      if (!selectedUserId) {
        showWarning('Veuillez sélectionner un utilisateur');
        return;
      }

      const existingMember = members.find(m => m.user_id === selectedUserId);
      if (existingMember) {
        showWarning('Cet utilisateur est déjà membre de ce service');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('service_members')
        .insert([{
          service_id: selectedServiceId,
          user_id: selectedUserId,
          added_by: user?.id || null,
          status: 'active',
          notes: notes || null,
        }]);

      if (error) throw error;

      await fetchMembers(selectedServiceId);
      handleCancel();
      showSuccess('Membre ajouté avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de l\'ajout du membre');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ isOpen: true, memberId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.memberId) return;

    try {
      const { error } = await supabase
        .from('service_members')
        .update({ status: 'inactive' })
        .eq('id', deleteConfirm.memberId);

      if (error) throw error;
      await fetchMembers(selectedServiceId);
      showSuccess('Membre retiré avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la suppression');
    } finally {
      setDeleteConfirm({ isOpen: false, memberId: null });
    }
  };

  const filteredProfiles = allProfiles.filter(profile => 
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableProfiles = filteredProfiles.filter(profile =>
    !members.some(m => m.user_id === profile.id)
  );

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Gestion des membres de service</h2>
          <button
            onClick={handleAddMember}
            disabled={!selectedServiceId}
            className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>Ajouter un membre</span>
          </button>
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
          <p className="text-sm text-gray-600">
            {members.length} membre(s) pour ce service
          </p>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <UserPlus size={20} className="mr-2" />
              Ajouter un membre
            </h3>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search size={16} className="inline mr-1" />
                Rechercher un utilisateur
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Nom ou email..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un utilisateur *
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Choisir un utilisateur --</option>
                {availableProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name} {profile.email ? `(${profile.email})` : ''}
                  </option>
                ))}
              </select>
              {availableProfiles.length === 0 && searchTerm && (
                <p className="text-sm text-gray-500 mt-1">Aucun utilisateur disponible trouvé</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Notes sur ce membre..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
            >
              <Plus size={18} />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {member.profile?.full_name || 'Utilisateur inconnu'}
                </h3>
                {member.profile?.role && (
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-1">
                    {member.profile.role}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Retirer du service"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {member.profile?.email && (
                <div className="flex items-center">
                  <span className="text-gray-500">📧</span>
                  <span className="ml-2 truncate">{member.profile.email}</span>
                </div>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <span>Ajouté le {new Date(member.joined_at).toLocaleDateString('fr-FR')}</span>
              </div>
              {member.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <strong>Notes:</strong> {member.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre</h3>
          <p className="text-gray-600">Commencez par ajouter des membres à ce service</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Retirer le membre"
        message="Êtes-vous sûr de vouloir retirer ce membre du service ? Il pourra être rajouté ultérieurement."
        confirmText="Retirer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, memberId: null })}
        type="danger"
      />
    </div>
  );
};
