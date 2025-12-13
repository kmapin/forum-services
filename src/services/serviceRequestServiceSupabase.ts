import { 
  ServiceRequest, 
  CreateServiceRequestDTO, 
  ServiceRequestResponse 
} from '../types/serviceRequest';
import { supabase, ServiceRequestDB } from '../lib/supabase';

/**
 * Service pour gérer les demandes d'intérêt pour les services de conciergerie
 * Utilise Supabase comme backend
 */
class ServiceRequestServiceSupabase {
  private readonly TABLE_NAME = 'service_requests';

  /**
   * Convertit un objet ServiceRequestDB (Supabase) en ServiceRequest (app)
   */
  private mapDBToApp(dbRequest: ServiceRequestDB): ServiceRequest {
    return {
      id: dbRequest.id,
      serviceId: dbRequest.service_id,
      serviceName: dbRequest.service_name,
      serviceSlug: dbRequest.service_slug,
      lastName: dbRequest.last_name,
      firstName: dbRequest.first_name,
      email: dbRequest.email,
      phone: dbRequest.phone,
      address: dbRequest.address,
      message: dbRequest.message,
      status: dbRequest.status,
      createdAt: dbRequest.created_at,
      updatedAt: dbRequest.updated_at
    };
  }

  /**
   * Convertit un CreateServiceRequestDTO en format Supabase
   */
  private mapAppToDB(data: CreateServiceRequestDTO): Omit<ServiceRequestDB, 'id' | 'created_at' | 'updated_at'> {
    return {
      service_id: data.serviceId,
      service_name: data.serviceName,
      service_slug: data.serviceSlug,
      last_name: data.lastName,
      first_name: data.firstName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      message: data.message,
      status: 'pending'
    };
  }

  /**
   * Crée une nouvelle demande d'intérêt
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

      // Préparer les données pour Supabase
      const dbData = this.mapAppToDB(data);

      // Insérer dans Supabase
      const { data: insertedData, error } = await supabase
        .from(this.TABLE_NAME)
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur Supabase lors de l\'insertion:', error);
        return {
          success: false,
          error: 'Erreur lors de l\'enregistrement de votre demande'
        };
      }

      // Convertir en format app
      const appData = this.mapDBToApp(insertedData as ServiceRequestDB);

      // Log dans la console pour debug
      console.log('📝 Nouvelle demande de service enregistrée dans Supabase:', {
        id: appData.id,
        service: appData.serviceName,
        client: `${appData.firstName} ${appData.lastName}`,
        email: appData.email,
        phone: appData.phone,
        createdAt: appData.createdAt
      });

      return {
        success: true,
        data: appData,
        message: 'Demande enregistrée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création de la demande:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de l\'enregistrement de votre demande'
      };
    }
  }

  /**
   * Récupère toutes les demandes
   * Nécessite une authentification admin
   */
  async getAllRequests(): Promise<ServiceRequest[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur Supabase lors de la récupération:', error);
        return [];
      }

      return (data as ServiceRequestDB[]).map(this.mapDBToApp);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des demandes:', error);
      return [];
    }
  }

  /**
   * Récupère une demande par son ID
   */
  async getRequestById(id: string): Promise<ServiceRequest | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Erreur Supabase lors de la récupération:', error);
        return null;
      }

      return data ? this.mapDBToApp(data as ServiceRequestDB) : null;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la demande:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut d'une demande
   * Nécessite une authentification admin
   */
  async updateRequestStatus(
    id: string, 
    status: ServiceRequest['status']
  ): Promise<ServiceRequestResponse> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur Supabase lors de la mise à jour:', error);
        return {
          success: false,
          error: 'Erreur lors de la mise à jour du statut'
        };
      }

      return {
        success: true,
        data: this.mapDBToApp(data as ServiceRequestDB),
        message: 'Statut mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de la mise à jour'
      };
    }
  }

  /**
   * Supprime une demande
   * Nécessite une authentification admin
   */
  async deleteRequest(id: string): Promise<ServiceRequestResponse> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erreur Supabase lors de la suppression:', error);
        return {
          success: false,
          error: 'Erreur lors de la suppression'
        };
      }

      return {
        success: true,
        message: 'Demande supprimée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la demande:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de la suppression'
      };
    }
  }

  /**
   * Récupère les statistiques des demandes
   */
  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byService: Record<string, number>;
    recent: number;
  }> {
    try {
      const requests = await this.getAllRequests();
      
      const stats = {
        total: requests.length,
        byStatus: {
          pending: requests.filter(r => r.status === 'pending').length,
          contacted: requests.filter(r => r.status === 'contacted').length,
          completed: requests.filter(r => r.status === 'completed').length,
          cancelled: requests.filter(r => r.status === 'cancelled').length
        },
        byService: {} as Record<string, number>,
        recent: 0
      };

      // Compter par service
      requests.forEach(r => {
        stats.byService[r.serviceName] = (stats.byService[r.serviceName] || 0) + 1;
      });

      // Compter les demandes des 7 derniers jours
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      stats.recent = requests.filter(r => new Date(r.createdAt) > sevenDaysAgo).length;

      return stats;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      return {
        total: 0,
        byStatus: {},
        byService: {},
        recent: 0
      };
    }
  }

  /**
   * Exporte toutes les demandes en JSON
   */
  async exportRequests(): Promise<void> {
    try {
      const requests = await this.getAllRequests();
      const dataStr = JSON.stringify(requests, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `service-requests-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      console.log('📥 Export des demandes réussi');
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
    }
  }
}

// Export d'une instance unique (singleton)
export const serviceRequestService = new ServiceRequestServiceSupabase();
