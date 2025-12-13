/**
 * Exemples d'utilisation du système de demandes de service
 * Ce fichier montre comment utiliser le serviceRequestService
 */

import { serviceRequestService } from '../services/serviceRequestService';

/**
 * Exemple 1: Créer une nouvelle demande
 */
export const exampleCreateRequest = async () => {
  console.log('📝 Exemple 1: Création d\'une demande');
  
  const response = await serviceRequestService.createServiceRequest({
    serviceId: 'repassage',
    serviceName: 'Repassage',
    serviceSlug: 'repassage',
    lastName: 'Martin',
    firstName: 'Sophie',
    email: 'sophie.martin@example.com',
    phone: '06 12 34 56 78',
    address: '15 avenue des Champs-Élysées, 75008 Paris',
    message: 'Je souhaiterais un devis pour un service de repassage hebdomadaire'
  });

  if (response.success) {
    console.log('✅ Demande créée avec succès:', response.data);
    return response.data;
  } else {
    console.error('❌ Erreur:', response.error);
    return null;
  }
};

/**
 * Exemple 2: Récupérer toutes les demandes
 */
export const exampleGetAllRequests = async () => {
  console.log('📋 Exemple 2: Récupération de toutes les demandes');
  
  const requests = await serviceRequestService.getAllRequests();
  console.log(`Nombre de demandes: ${requests.length}`);
  
  requests.forEach((request, index) => {
    console.log(`${index + 1}. ${request.firstName} ${request.lastName} - ${request.serviceName} (${request.status})`);
  });
  
  return requests;
};

/**
 * Exemple 3: Récupérer une demande spécifique
 */
export const exampleGetRequestById = async (id: string) => {
  console.log(`🔍 Exemple 3: Récupération de la demande ${id}`);
  
  const request = await serviceRequestService.getRequestById(id);
  
  if (request) {
    console.log('✅ Demande trouvée:', {
      client: `${request.firstName} ${request.lastName}`,
      service: request.serviceName,
      email: request.email,
      statut: request.status
    });
    return request;
  } else {
    console.log('❌ Demande non trouvée');
    return null;
  }
};

/**
 * Exemple 4: Mettre à jour le statut d'une demande
 */
export const exampleUpdateStatus = async (id: string) => {
  console.log(`🔄 Exemple 4: Mise à jour du statut de la demande ${id}`);
  
  const response = await serviceRequestService.updateRequestStatus(id, 'contacted');
  
  if (response.success) {
    console.log('✅ Statut mis à jour:', response.data?.status);
    return response.data;
  } else {
    console.error('❌ Erreur:', response.error);
    return null;
  }
};

/**
 * Exemple 5: Créer plusieurs demandes de test
 */
export const exampleCreateMultipleRequests = async () => {
  console.log('📝 Exemple 5: Création de plusieurs demandes de test');
  
  const testRequests = [
    {
      serviceId: 'tonte-gazon',
      serviceName: 'Tonte de gazon',
      serviceSlug: 'tonte-gazon',
      lastName: 'Dubois',
      firstName: 'Pierre',
      email: 'pierre.dubois@example.com',
      phone: '06 23 45 67 89',
      message: 'Besoin d\'une tonte hebdomadaire pour un jardin de 200m²'
    },
    {
      serviceId: 'babysitting',
      serviceName: 'Babysitting',
      serviceSlug: 'babysitting',
      lastName: 'Bernard',
      firstName: 'Marie',
      email: 'marie.bernard@example.com',
      phone: '06 34 56 78 90',
      address: '42 rue de la République, 69001 Lyon',
      message: 'Recherche baby-sitter pour 2 enfants (3 et 5 ans) les mercredis'
    },
    {
      serviceId: 'lavage-voiture',
      serviceName: 'Lavage de voiture',
      serviceSlug: 'lavage-voiture',
      lastName: 'Petit',
      firstName: 'Thomas',
      email: 'thomas.petit@example.com',
      phone: '06 45 67 89 01'
    }
  ];

  const results = [];
  
  for (const request of testRequests) {
    const response = await serviceRequestService.createServiceRequest(request);
    if (response.success) {
      console.log(`✅ Demande créée: ${request.serviceName} - ${request.firstName} ${request.lastName}`);
      results.push(response.data);
    } else {
      console.error(`❌ Erreur pour ${request.serviceName}:`, response.error);
    }
  }
  
  console.log(`\n📊 Résultat: ${results.length}/${testRequests.length} demandes créées`);
  return results;
};

/**
 * Exemple 6: Workflow complet
 */
export const exampleCompleteWorkflow = async () => {
  console.log('🔄 Exemple 6: Workflow complet\n');
  
  // 1. Créer une demande
  console.log('Étape 1: Création d\'une demande');
  const createResponse = await serviceRequestService.createServiceRequest({
    serviceId: 'demenagement',
    serviceName: 'Déménagement',
    serviceSlug: 'demenagement',
    lastName: 'Moreau',
    firstName: 'Julie',
    email: 'julie.moreau@example.com',
    phone: '06 56 78 90 12',
    address: '10 boulevard Voltaire, 75011 Paris',
    message: 'Déménagement d\'un appartement T3 prévu pour le mois prochain'
  });
  
  if (!createResponse.success || !createResponse.data) {
    console.error('❌ Échec de la création');
    return;
  }
  
  const requestId = createResponse.data.id;
  console.log(`✅ Demande créée avec l'ID: ${requestId}\n`);
  
  // 2. Récupérer la demande
  console.log('Étape 2: Récupération de la demande');
  const request = await serviceRequestService.getRequestById(requestId);
  console.log(`✅ Demande récupérée: ${request?.firstName} ${request?.lastName}\n`);
  
  // 3. Mettre à jour le statut
  console.log('Étape 3: Mise à jour du statut en "contacted"');
  await serviceRequestService.updateRequestStatus(requestId, 'contacted');
  console.log('✅ Statut mis à jour\n');
  
  // 4. Vérifier la mise à jour
  console.log('Étape 4: Vérification de la mise à jour');
  const updatedRequest = await serviceRequestService.getRequestById(requestId);
  console.log(`✅ Nouveau statut: ${updatedRequest?.status}\n`);
  
  // 5. Afficher toutes les demandes
  console.log('Étape 5: Liste de toutes les demandes');
  const allRequests = await serviceRequestService.getAllRequests();
  console.log(`✅ Total: ${allRequests.length} demande(s)\n`);
  
  console.log('🎉 Workflow terminé avec succès!');
  return updatedRequest;
};

// Exposer les exemples dans window en développement
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).examples = {
    createRequest: exampleCreateRequest,
    getAllRequests: exampleGetAllRequests,
    getRequestById: exampleGetRequestById,
    updateStatus: exampleUpdateStatus,
    createMultiple: exampleCreateMultipleRequests,
    completeWorkflow: exampleCompleteWorkflow
  };
  
  console.log('📚 Exemples disponibles dans window.examples');
  console.log('Essayez:');
  console.log('  - examples.createRequest()');
  console.log('  - examples.getAllRequests()');
  console.log('  - examples.createMultiple()');
  console.log('  - examples.completeWorkflow()');
}
