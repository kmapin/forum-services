import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload } from 'lucide-react';
import { supabase, About } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';

export const AboutAdmin: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newValue, setNewValue] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    mission: '',
    vision: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });

  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setAbout(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          image_url: data.image_url || '',
          mission: data.mission || '',
          vision: data.vision || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          address: data.address || '',
        });
        setValues(data.values || []);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const dataToSave = {
        ...formData,
        values,
        updated_at: new Date().toISOString(),
      };

      if (about) {
        const { error } = await supabase
          .from('about')
          .update(dataToSave)
          .eq('id', about.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about')
          .insert([dataToSave]);

        if (error) throw error;
      }

      await fetchAbout();
      showSuccess('Enregistré avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError(err.message || 'Erreur lors de l\'enregistrement');
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (newValue.trim()) {
      setValues([...values, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
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
        <h2 className="text-xl font-bold text-gray-900">Gestion de la page À propos</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50"
        >
          <Save size={18} />
          <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            placeholder="Titre de la page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            placeholder="Description de l'église"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL de l'image</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="https://..."
            />
            <button className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              <Upload size={18} />
              <span>Upload</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
          <textarea
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            placeholder="Mission de l'église"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
          <textarea
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            placeholder="Vision de l'église"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valeurs</label>
          <div className="space-y-2">
            {values.map((value, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = e.target.value;
                    setValues(newValues);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={() => removeValue(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Nouvelle valeur"
              />
              <button
                onClick={addValue}
                className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
              >
                <Plus size={18} />
                <span>Ajouter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="contact@eglise.fr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="+33 1 23 45 67 89"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="123 Rue de l'Église"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
