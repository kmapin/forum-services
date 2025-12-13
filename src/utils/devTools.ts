/**
 * Outils de développement pour faciliter le debug
 * À utiliser uniquement en développement
 */

import { serviceRequestService } from '../services/serviceRequestService';

/**
 * Affiche toutes les demandes stockées dans la console
 */
export const logAllRequests = async () => {
  const requests = await serviceRequestService.getAllRequests();
  console.group('📋 Toutes les demandes de service');
  console.log(`Total: ${requests.length} demande(s)`);
  console.table(requests.map(r => ({
    ID: r.id,
    Service: r.serviceName,
    Client: `${r.firstName} ${r.lastName}`,
    Email: r.email,
    Téléphone: r.phone,
    Statut: r.status,
    Date: new Date(r.createdAt).toLocaleString('fr-FR')
  })));
  console.groupEnd();
  return requests;
};

/**
 * Affiche les détails d'une demande spécifique
 */
export const logRequestDetails = async (id: string) => {
  const request = await serviceRequestService.getRequestById(id);
  if (request) {
    console.group(`📄 Détails de la demande ${id}`);
    console.log('Service:', request.serviceName);
    console.log('Client:', `${request.firstName} ${request.lastName}`);
    console.log('Email:', request.email);
    console.log('Téléphone:', request.phone);
    console.log('Adresse:', request.address || 'Non renseignée');
    console.log('Message:', request.message || 'Aucun message');
    console.log('Statut:', request.status);
    console.log('Créé le:', new Date(request.createdAt).toLocaleString('fr-FR'));
    console.log('Mis à jour le:', new Date(request.updatedAt).toLocaleString('fr-FR'));
    console.groupEnd();
  } else {
    console.warn(`⚠️ Demande ${id} non trouvée`);
  }
  return request;
};

/**
 * Exporte toutes les demandes en JSON
 */
export const exportRequests = () => {
  serviceRequestService.exportRequests();
  console.log('📥 Export des demandes lancé');
};

/**
 * Supprime toutes les demandes (ATTENTION: irréversible)
 */
export const clearAllRequests = () => {
  if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les demandes ?')) {
    serviceRequestService.clearAllRequests();
    console.log('🗑️ Toutes les demandes ont été supprimées');
  }
};

/**
 * Affiche les statistiques des demandes
 */
export const showRequestStats = async () => {
  const requests = await serviceRequestService.getAllRequests();
  
  const stats = {
    total: requests.length,
    parStatut: {
      pending: requests.filter(r => r.status === 'pending').length,
      contacted: requests.filter(r => r.status === 'contacted').length,
      completed: requests.filter(r => r.status === 'completed').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length
    },
    parService: {} as Record<string, number>
  };

  requests.forEach(r => {
    stats.parService[r.serviceName] = (stats.parService[r.serviceName] || 0) + 1;
  });

  console.group('📊 Statistiques des demandes');
  console.log('Total:', stats.total);
  console.log('Par statut:', stats.parStatut);
  console.log('Par service:', stats.parService);
  console.groupEnd();

  return stats;
};

// Exposer les outils dans window pour un accès facile depuis la console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).devTools = {
    logAllRequests,
    logRequestDetails,
    exportRequests,
    clearAllRequests,
    showRequestStats,
    serviceRequestService
  };
  
  console.log('🛠️ DevTools disponibles dans window.devTools');
  console.log('Commandes disponibles:');
  console.log('  - devTools.logAllRequests() : Afficher toutes les demandes');
  console.log('  - devTools.logRequestDetails(id) : Afficher les détails d\'une demande');
  console.log('  - devTools.showRequestStats() : Afficher les statistiques');
  console.log('  - devTools.exportRequests() : Exporter en JSON');
  console.log('  - devTools.clearAllRequests() : Supprimer toutes les demandes');
}
