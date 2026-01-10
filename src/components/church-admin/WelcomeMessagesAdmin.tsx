import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, MessageSquare, Upload, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase, WelcomeMessage } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export const WelcomeMessagesAdmin: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [messages, setMessages] = useState<WelcomeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<WelcomeMessage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<WelcomeMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; messageId: string | null }>({ isOpen: false, messageId: null });

  const emptyMessage: Partial<WelcomeMessage> = {
    title: '',
    message: '',
    image_url: '',
    cta_text: 'En savoir plus',
    cta_action: 'about',
    is_active: true,
  };

  const [formData, setFormData] = useState<Partial<WelcomeMessage>>(emptyMessage);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('welcome_message')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData(emptyMessage);
    setIsCreating(true);
    setEditingMessage(null);
  };

  const handleEdit = (message: WelcomeMessage) => {
    setFormData(message);
    setEditingMessage(message);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setFormData(emptyMessage);
    setEditingMessage(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.message) {
        showWarning('Le titre et le message sont requis');
        return;
      }

      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (editingMessage) {
        const { error } = await supabase
          .from('welcome_message')
          .update(dataToSave)
          .eq('id', editingMessage.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('welcome_message')
          .insert([dataToSave]);

        if (error) throw error;
      }

      await fetchMessages();
      handleCancel();
      showSuccess('Message enregistré avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ isOpen: true, messageId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.messageId) return;

    try {
      const { error } = await supabase
        .from('welcome_message')
        .delete()
        .eq('id', deleteConfirm.messageId);

      if (error) throw error;
      await fetchMessages();
      showSuccess('Message supprimé avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la suppression');
    } finally {
      setDeleteConfirm({ isOpen: false, messageId: null });
    }
  };

  const toggleActive = async (message: WelcomeMessage) => {
    try {
      const { error } = await supabase
        .from('welcome_message')
        .update({ is_active: !message.is_active })
        .eq('id', message.id);

      if (error) throw error;
      await fetchMessages();
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
          <h2 className="text-xl font-bold text-gray-900">Gestion des messages d'accueil</h2>
          <p className="text-sm text-gray-600">{messages.length} message(s)</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
        >
          <Plus size={18} />
          <span>Nouveau message</span>
        </button>
      </div>

      {(isCreating || editingMessage) && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingMessage ? 'Modifier le message' : 'Nouveau message'}
            </h3>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Titre du message d'accueil"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Contenu du message d'accueil"
              />
            </div>

            <div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton</label>
                <input
                  type="text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="En savoir plus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action du bouton</label>
                <select
                  value={formData.cta_action}
                  onChange={(e) => setFormData({ ...formData, cta_action: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="about">À propos</option>
                  <option value="events">Événements</option>
                  <option value="meetings">Réunions</option>
                  <option value="contact">Contact</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">Message actif</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Seul le message actif le plus récent sera affiché dans l'application
              </p>
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${
              !message.is_active ? 'opacity-60' : ''
            }`}
          >
            {message.image_url && (
              <img
                src={message.image_url}
                alt={message.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{message.title}</h3>
                <button
                  onClick={() => toggleActive(message)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {message.is_active ? (
                    <ToggleRight size={24} className="text-teal-500" />
                  ) : (
                    <ToggleLeft size={24} />
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{message.message}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>CTA: {message.cta_text}</span>
                <span>→ {message.cta_action}</span>
              </div>

              <div className="flex justify-end space-x-2 border-t pt-3">
                <button
                  onClick={() => setPreviewMessage(message)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Prévisualiser"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(message)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
          <p className="text-gray-600">Commencez par créer votre premier message d'accueil</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Prévisualisation</h3>
                <button
                  onClick={() => setPreviewMessage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {previewMessage.image_url && (
                <img
                  src={previewMessage.image_url}
                  alt={previewMessage.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{previewMessage.title}</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{previewMessage.message}</p>

              <button className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600">
                {previewMessage.cta_text}
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                Action: {previewMessage.cta_action}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message d'accueil ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, messageId: null })}
        type="danger"
      />
    </div>
  );
};
