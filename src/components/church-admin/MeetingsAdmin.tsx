import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, MapPin, Clock, Calendar, Mail, Phone, Info, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase, Meeting, MeetingType } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export const MeetingsAdmin: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; meetingId: string | null }>({ isOpen: false, meetingId: null });

  const meetingTypes: { value: MeetingType; label: string }[] = [
    { value: 'prayer', label: 'Prières' },
    { value: 'bible_study', label: 'Études bibliques' },
    { value: 'youth', label: 'Groupe des jeunes' },
    { value: 'teens', label: 'Groupe des ados' },
    { value: 'house_groups', label: 'Groupes de maisons' },
    { value: 'intercession', label: 'Groupe d\'intercession' },
    { value: 'flames', label: 'Cœur des flammes' },
    { value: 'support', label: 'Soutien scolaire' },
  ];

  const daysOfWeek = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
  ];

  const emptyMeeting: Partial<Meeting> = {
    title: '',
    description: '',
    type: 'prayer',
    day_of_week: '',
    time: '',
    location: '',
    is_active: true,
    contact_1_name: '',
    contact_1_email: '',
    contact_1_phone: '',
    contact_1_info: '',
    contact_2_name: '',
    contact_2_email: '',
    contact_2_phone: '',
    contact_2_info: '',
    contact_3_name: '',
    contact_3_email: '',
    contact_3_phone: '',
    contact_3_info: '',
  };

  const [formData, setFormData] = useState<Partial<Meeting>>(emptyMeeting);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('type', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des réunions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData(emptyMeeting);
    setIsCreating(true);
    setEditingMeeting(null);
  };

  const handleEdit = (meeting: Meeting) => {
    setFormData(meeting);
    setEditingMeeting(meeting);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setFormData(emptyMeeting);
    setEditingMeeting(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.type) {
        showWarning('Le titre et le type sont requis');
        return;
      }

      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (editingMeeting) {
        const { error } = await supabase
          .from('meetings')
          .update(dataToSave)
          .eq('id', editingMeeting.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('meetings')
          .insert([dataToSave]);

        if (error) throw error;
      }

      await fetchMeetings();
      handleCancel();
      showSuccess('Réunion enregistrée avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ isOpen: true, meetingId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.meetingId) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', deleteConfirm.meetingId);

      if (error) throw error;
      await fetchMeetings();
      showSuccess('Réunion supprimée avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la suppression');
    } finally {
      setDeleteConfirm({ isOpen: false, meetingId: null });
    }
  };

  const toggleActive = async (meeting: Meeting) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ is_active: !meeting.is_active })
        .eq('id', meeting.id);

      if (error) throw error;
      await fetchMeetings();
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des réunions</h2>
          <p className="text-sm text-gray-600">{meetings.length} réunion(s)</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
        >
          <Plus size={18} />
          <span>Nouvelle réunion</span>
        </button>
      </div>

      {(isCreating || editingMeeting) && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingMeeting ? 'Modifier la réunion' : 'Nouvelle réunion'}
            </h3>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Titre de la réunion"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Description de la réunion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MeetingType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {meetingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Jour de la semaine
              </label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Sélectionner...</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                Heure
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Lieu
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Lieu de la réunion"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">Réunion active</span>
              </label>
            </div>
          </div>

          {/* Contact 1 */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Contact 1 (Requis)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.contact_1_name}
                  onChange={(e) => setFormData({ ...formData, contact_1_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={14} className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contact_1_email}
                  onChange={(e) => setFormData({ ...formData, contact_1_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={14} className="inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.contact_1_phone}
                  onChange={(e) => setFormData({ ...formData, contact_1_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Info size={14} className="inline mr-1" />
                  Info supplémentaire
                </label>
                <input
                  type="text"
                  value={formData.contact_1_info}
                  onChange={(e) => setFormData({ ...formData, contact_1_info: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Contact 2 */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Contact 2 (Optionnel)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.contact_2_name}
                  onChange={(e) => setFormData({ ...formData, contact_2_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contact_2_email}
                  onChange={(e) => setFormData({ ...formData, contact_2_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.contact_2_phone}
                  onChange={(e) => setFormData({ ...formData, contact_2_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Info supplémentaire</label>
                <input
                  type="text"
                  value={formData.contact_2_info}
                  onChange={(e) => setFormData({ ...formData, contact_2_info: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Contact 3 */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Contact 3 (Optionnel)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.contact_3_name}
                  onChange={(e) => setFormData({ ...formData, contact_3_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contact_3_email}
                  onChange={(e) => setFormData({ ...formData, contact_3_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.contact_3_phone}
                  onChange={(e) => setFormData({ ...formData, contact_3_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Info supplémentaire</label>
                <input
                  type="text"
                  value={formData.contact_3_info}
                  onChange={(e) => setFormData({ ...formData, contact_3_info: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
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
              <Save size={18} />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className={`bg-white rounded-lg shadow p-6 ${!meeting.is_active ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{meeting.title}</h3>
                <span className="text-sm text-gray-500">
                  {meetingTypes.find(t => t.value === meeting.type)?.label}
                </span>
              </div>
              <button
                onClick={() => toggleActive(meeting)}
                className="text-gray-400 hover:text-gray-600"
              >
                {meeting.is_active ? <ToggleRight size={24} className="text-teal-500" /> : <ToggleLeft size={24} />}
              </button>
            </div>

            {meeting.description && (
              <p className="text-sm text-gray-600 mb-4">{meeting.description}</p>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {meeting.day_of_week && (
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  {meeting.day_of_week}
                </div>
              )}
              {meeting.time && (
                <div className="flex items-center">
                  <Clock size={14} className="mr-2" />
                  {meeting.time}
                </div>
              )}
              {meeting.location && (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  {meeting.location}
                </div>
              )}
            </div>

            {meeting.contact_1_name && (
              <div className="border-t pt-3 mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Contact</p>
                <p className="text-sm text-gray-900">{meeting.contact_1_name}</p>
                {meeting.contact_1_email && (
                  <p className="text-xs text-gray-600">{meeting.contact_1_email}</p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2 border-t pt-3">
              <button
                onClick={() => handleEdit(meeting)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(meeting.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {meetings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réunion</h3>
          <p className="text-gray-600">Commencez par créer votre première réunion</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Supprimer la réunion"
        message="Êtes-vous sûr de vouloir supprimer cette réunion ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, meetingId: null })}
        type="danger"
      />
    </div>
  );
};
