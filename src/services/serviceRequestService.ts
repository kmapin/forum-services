import { 
  ServiceRequest, 
  CreateServiceRequestDTO, 
  ServiceRequestResponse 
} from '../types/serviceRequest';

const STORAGE_KEY = 'concierge_service_requests';
// const API_ENDPOINT = '/api/service-requests'; // À configurer lors de la migration vers une vraie API

/**
 * Service pour gérer les demandes d'intérêt pour les services de conciergerie
 * Architecture prête pour une connexion API future
 */
class ServiceRequestService {
  /**
   * Génère un ID unique pour une demande
   */
  private generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Récupère toutes les demandes depuis le localStorage
   */
  private getStoredRequests(): ServiceRequest[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      return [];
    }
  }

  /**
   * Sauvegarde les demandes dans le localStorage
   */
  private saveRequests(requests: ServiceRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des demandes:', error);
    }
  }

  /**
   * Simule un appel API avec un délai
   */
  private async simulateApiCall<T>(data: T, delay: number = 500): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }

  /**
   * Crée une nouvelle demande d'intérêt
   * Pour l'instant stocke en localStorage, facilement remplaçable par un appel API
   */
  async createServiceRequest(
    data: CreateServiceRequestDTO
  ): Promise<ServiceRequestResponse> {
    try {
      // Validation des données
      if (!data.lastName || !data.firstName || !data.email || !data.phone) {
        return {
          success: false,
          error: 'Tous les champs obligatoires doivent être remplis'
        };
      }

      // Création de l'objet demande
      const now = new Date().toISOString();
      const newRequest: ServiceRequest = {
        id: this.generateId(),
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        serviceSlug: data.serviceSlug,
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        message: data.message,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      };

      // Log dans la console pour debug
      console.log('📝 Nouvelle demande de service:', {
        id: newRequest.id,
        service: newRequest.serviceName,
        client: `${newRequest.firstName} ${newRequest.lastName}`,
        email: newRequest.email,
        phone: newRequest.phone,
        createdAt: newRequest.createdAt
      });

      // Stockage localStorage (à remplacer par un appel API)
      const requests = this.getStoredRequests();
      requests.push(newRequest);
      this.saveRequests(requests);

      // Simulation d'un délai réseau
      await this.simulateApiCall(newRequest, 300);

      // TODO: Remplacer par un vrai appel API
      // const response = await fetch(API_ENDPOINT, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data)
      // });
      // const result = await response.json();
      // return result;

      return {
        success: true,
        data: newRequest,
        message: 'Demande enregistrée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de l\'enregistrement de votre demande'
      };
    }
  }

  /**
   * Récupère toutes les demandes
   * Utile pour un dashboard admin futur
   */
  async getAllRequests(): Promise<ServiceRequest[]> {
    try {
      // TODO: Remplacer par un appel API
      // const response = await fetch(API_ENDPOINT);
      // const data = await response.json();
      // return data;

      const requests = this.getStoredRequests();
      await this.simulateApiCall(requests, 200);
      return requests;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      return [];
    }
  }

  /**
   * Récupère une demande par son ID
   */
  async getRequestById(id: string): Promise<ServiceRequest | null> {
    try {
      // TODO: Remplacer par un appel API
      // const response = await fetch(`${API_ENDPOINT}/${id}`);
      // const data = await response.json();
      // return data;

      const requests = this.getStoredRequests();
      const request = requests.find(r => r.id === id);
      await this.simulateApiCall(request, 200);
      return request || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la demande:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut d'une demande
   */
  async updateRequestStatus(
    id: string, 
    status: ServiceRequest['status']
  ): Promise<ServiceRequestResponse> {
    try {
      const requests = this.getStoredRequests();
      const index = requests.findIndex(r => r.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Demande non trouvée'
        };
      }

      requests[index].status = status;
      requests[index].updatedAt = new Date().toISOString();
      this.saveRequests(requests);

      // TODO: Remplacer par un appel API
      // const response = await fetch(`${API_ENDPOINT}/${id}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status })
      // });
      // const result = await response.json();
      // return result;

      await this.simulateApiCall(requests[index], 200);

      return {
        success: true,
        data: requests[index],
        message: 'Statut mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de la mise à jour'
      };
    }
  }

  /**
   * Supprime une demande
   */
  async deleteRequest(id: string): Promise<ServiceRequestResponse> {
    try {
      const requests = this.getStoredRequests();
      const filteredRequests = requests.filter(r => r.id !== id);

      if (requests.length === filteredRequests.length) {
        return {
          success: false,
          error: 'Demande non trouvée'
        };
      }

      this.saveRequests(filteredRequests);

      // TODO: Remplacer par un appel API
      // const response = await fetch(`${API_ENDPOINT}/${id}`, {
      //   method: 'DELETE'
      // });
      // const result = await response.json();
      // return result;

      await this.simulateApiCall(null, 200);

      return {
        success: true,
        message: 'Demande supprimée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de la suppression'
      };
    }
  }

  /**
   * Exporte toutes les demandes (utile pour debug ou migration)
   */
  exportRequests(): void {
    const requests = this.getStoredRequests();
    const dataStr = JSON.stringify(requests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `service-requests-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Vide toutes les demandes (utile pour debug)
   */
  clearAllRequests(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Toutes les demandes ont été supprimées');
  }
}

// Export d'une instance unique (singleton)
export const serviceRequestService = new ServiceRequestService();
