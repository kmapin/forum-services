import React, { useState, useEffect } from 'react';
import { serviceRequestService } from '../services/serviceRequestServiceSupabase';
import { ServiceRequest } from '../types/serviceRequest';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Loader2
} from 'lucide-react';

export const ServiceRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    byStatus: {} as Record<string, number>,
    byService: {} as Record<string, number>,
    recent: 0
  });

  // Charger les demandes au montage
  useEffect(() => {
    loadRequests();
    loadStatistics();
  }, []);

  // Filtrer les demandes quand les filtres changent
  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await serviceRequestService.getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await serviceRequestService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.firstName.toLowerCase().includes(term) ||
        r.lastName.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.phone.includes(term) ||
        r.serviceName.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleStatusChange = async (id: string, newStatus: ServiceRequest['status']) => {
    try {
      const response = await serviceRequestService.updateRequestStatus(id, newStatus);
      if (response.success) {
        await loadRequests();
        await loadStatistics();
        if (selectedRequest?.id === id) {
          setSelectedRequest(response.data || null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleExport = async () => {
    await serviceRequestService.exportRequests();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'contacted': return <Phone size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'contacted': return 'Contacté';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Demandes de Services de Conciergerie
        </h2>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-blue-600 text-sm font-semibold mb-1">Total</div>
            <div className="text-3xl font-bold text-blue-900">{statistics.total}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="text-yellow-600 text-sm font-semibold mb-1">En attente</div>
            <div className="text-3xl font-bold text-yellow-900">{statistics.byStatus.pending || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-green-600 text-sm font-semibold mb-1">Terminés</div>
            <div className="text-3xl font-bold text-green-900">{statistics.byStatus.completed || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-purple-600 text-sm font-semibold mb-1">Cette semaine</div>
            <div className="text-3xl font-bold text-purple-900">{statistics.recent}</div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
            />
          </div>

          {/* Filtre par statut */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none appearance-none bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="contacted">Contacté</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          {/* Bouton export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Download size={20} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-teal-500" size={40} />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {request.firstName} {request.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.serviceName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{request.email}</div>
                      <div className="text-sm text-gray-600">{request.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Détails de la demande
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Informations client */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Informations client</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Nom complet</div>
                      <div className="font-semibold">{selectedRequest.firstName} {selectedRequest.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Service demandé</div>
                      <div className="font-semibold">{selectedRequest.serviceName}</div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${selectedRequest.email}`} className="text-teal-600 hover:underline">
                        {selectedRequest.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${selectedRequest.phone}`} className="text-teal-600 hover:underline">
                        {selectedRequest.phone}
                      </a>
                    </div>
                    {selectedRequest.address && (
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 mt-1" />
                        <span className="text-gray-700">{selectedRequest.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                {selectedRequest.message && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MessageSquare size={16} />
                      Message
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                )}

                {/* Statut */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Changer le statut</h4>
                  <div className="flex gap-2 flex-wrap">
                    {(['pending', 'contacted', 'completed', 'cancelled'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedRequest.id, status)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          selectedRequest.status === status
                            ? 'bg-teal-500 text-white'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>Créé le: {new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}</span>
                  <span>Modifié le: {new Date(selectedRequest.updatedAt).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
