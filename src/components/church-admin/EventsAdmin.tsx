import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar, MapPin, Clock, Upload, Youtube } from 'lucide-react';
import { supabase, Event } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export const EventsAdmin: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; eventId: string | null }>({ isOpen: false, eventId: null });

  const emptyEvent: Partial<Event> = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image_url: '',
    youtube_url: '',
  };

  const [formData, setFormData] = useState<Partial<Event>>(emptyEvent);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let query = supabase.from('events').select('*').order('date', { ascending: false });

      const today = new Date().toISOString().split('T')[0];
      
      if (filter === 'upcoming') {
        query = query.gte('date', today);
      } else if (filter === 'past') {
        query = query.lt('date', today);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData(emptyEvent);
    setIsCreating(true);
    setEditingEvent(null);
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setEditingEvent(event);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setFormData(emptyEvent);
    setEditingEvent(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.date) {
        showWarning('Le titre et la date sont requis');
        return;
      }

      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(dataToSave)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([dataToSave]);

        if (error) throw error;
      }

      await fetchEvents();
      handleCancel();
      showSuccess('Événement enregistré avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ isOpen: true, eventId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.eventId) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', deleteConfirm.eventId);

      if (error) throw error;
      await fetchEvents();
      showSuccess('Événement supprimé avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la suppression');
    } finally {
      setDeleteConfirm({ isOpen: false, eventId: null });
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
          <h2 className="text-xl font-bold text-gray-900">Gestion des événements</h2>
          <p className="text-sm text-gray-600">{events.length} événement(s)</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Tous</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passés</option>
          </select>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
          >
            <Plus size={18} />
            <span>Nouvel événement</span>
          </button>
        </div>
      </div>

      {(isCreating || editingEvent) && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
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
                placeholder="Titre de l'événement"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Description de l'événement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Lieu
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Adresse ou lieu de l'événement"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload size={16} className="inline mr-1" />
                URL de l'image
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Youtube size={16} className="inline mr-1" />
                URL YouTube
              </label>
              <input
                type="text"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.title}</h3>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  {new Date(event.date).toLocaleDateString('fr-FR')}
                </div>
                {event.time && (
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    {event.time}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2" />
                    {event.location}
                  </div>
                )}
              </div>

              {event.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement</h3>
          <p className="text-gray-600">Commencez par créer votre premier événement</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Supprimer l'événement"
        message="Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, eventId: null })}
        type="danger"
      />
    </div>
  );
};
