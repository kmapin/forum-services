import React, { useState, useEffect } from 'react';
import { Users, Edit2, Save, X, Search, Shield, User, Mail, Calendar, Key, Eye, EyeOff } from 'lucide-react';
import { supabase, Profile } from '../lib/supabase';
import { useNotification } from '../contexts/NotificationContext';

export const UsersAdmin: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState<{
    full_name: string;
    role: string;
    email: string;
  }>({
    full_name: '',
    role: '',
    email: ''
  });

  const roleOptions = [
    { value: 'member', label: 'Membre', color: 'bg-gray-100 text-gray-800' },
    { value: 'admin', label: 'Administrateur', color: 'bg-blue-100 text-blue-800' },
    { value: 'teacher', label: 'Enseignant', color: 'bg-green-100 text-green-800' },
    { value: 'moderator', label: 'Modérateur', color: 'bg-purple-100 text-purple-800' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Utiliser la fonction RPC qui joint profiles et auth.users pour récupérer les emails
      const { data, error } = await supabase.rpc('get_profiles_with_emails');

      if (error) throw error;
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: Profile) => {
    setEditingUserId(user.id);
    setEditForm({
      full_name: user.full_name || '',
      role: user.role || 'member',
      email: user.email || ''
    });
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditForm({
      full_name: '',
      role: '',
      email: ''
    });
  };

  const handleSave = async (userId: string) => {
    try {
      if (!editForm.full_name.trim()) {
        showWarning('Le nom complet est requis');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name.trim(),
          role: editForm.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      handleCancel();
      showSuccess('Profil mis à jour avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      showError('Erreur lors de la mise à jour du profil');
    }
  };

  const handleResetPassword = (userId: string) => {
    setResetPasswordUserId(userId);
    setNewPassword('');
    setShowPassword(false);
    setShowPasswordModal(true);
  };

  const confirmResetPassword = async () => {
    if (!resetPasswordUserId || !newPassword) {
      showWarning('Veuillez saisir un nouveau mot de passe');
      return;
    }

    if (newPassword.length < 6) {
      showWarning('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      // Appeler la fonction RPC pour changer le mot de passe
      const { data, error } = await supabase.rpc('admin_reset_user_password', {
        target_user_id: resetPasswordUserId,
        new_password: newPassword
      });

      if (error) throw error;

      setShowPasswordModal(false);
      setResetPasswordUserId(null);
      setNewPassword('');
      showSuccess('Mot de passe réinitialisé avec succès !');
    } catch (err: any) {
      console.error('Erreur:', err);
      const errorMessage = err.message || 'Erreur lors de la réinitialisation du mot de passe';
      showError(errorMessage);
    }
  };

  const getRoleColor = (role?: string) => {
    const roleOption = roleOptions.find(opt => opt.value === role);
    return roleOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role?: string) => {
    const roleOption = roleOptions.find(opt => opt.value === role);
    return roleOption?.label || role || 'Non défini';
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
          <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
          <p className="text-gray-600 mt-1">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Rechercher par nom, email ou rôle..."
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {editingUserId === user.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="Nom complet"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail size={16} className="mr-2" />
                          {user.email || 'Non renseigné'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleSave(user.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Enregistrer"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.full_name?.charAt(0)?.toUpperCase() || <User size={20} />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name || 'Non renseigné'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail size={16} className="mr-2" />
                          {user.email || 'Non renseigné'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          <Shield size={14} className="mr-1" />
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Modifier le profil"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Réinitialiser le mot de passe"
                          >
                            <Key size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Essayez de modifier votre recherche' : 'Aucun utilisateur enregistré'}
          </p>
        </div>
      )}

      {/* Modal de réinitialisation du mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Key className="mr-2 text-orange-600" size={24} />
                Réinitialiser le mot de passe
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setResetPasswordUserId(null);
                  setNewPassword('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Saisissez un nouveau mot de passe pour cet utilisateur. Le mot de passe doit contenir au moins 6 caractères.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Minimum 6 caractères"
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setResetPasswordUserId(null);
                  setNewPassword('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmResetPassword}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Key size={18} />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
