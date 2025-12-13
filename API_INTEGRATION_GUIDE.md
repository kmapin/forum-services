# Guide d'intégration API

Ce guide explique comment connecter le frontend à une API backend pour gérer les demandes de service.

## 🎯 Objectif

Remplacer le stockage localStorage par des appels API vers un serveur backend.

## 📋 Prérequis

- Un serveur backend avec une API REST ou GraphQL
- Les endpoints configurés pour gérer les demandes de service
- (Optionnel) Un système d'authentification

## 🔧 Étapes d'intégration

### 1. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet (s'il n'existe pas déjà) :

```env
VITE_API_URL=https://votre-api.com
VITE_API_KEY=votre_cle_api_optionnelle
```

### 2. Créer un fichier de configuration API

Créez `src/config/api.ts` :

```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  endpoints: {
    serviceRequests: '/api/service-requests',
  },
  headers: {
    'Content-Type': 'application/json',
    // Ajoutez d'autres headers si nécessaire
  },
  timeout: 10000, // 10 secondes
};

// Helper pour construire les URLs
export const buildURL = (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(endpoint, API_CONFIG.baseURL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};
```

### 3. Créer un client HTTP

Créez `src/services/apiClient.ts` :

```typescript
import { API_CONFIG } from '../config/api';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || 'Une erreur est survenue',
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Erreur de connexion au serveur');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
```

### 4. Modifier le serviceRequestService

Modifiez `src/services/serviceRequestService.ts` :

```typescript
import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api';

class ServiceRequestService {
  // ... autres méthodes ...

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

      // Appel API
      const result = await apiClient.post<ServiceRequest>(
        API_CONFIG.endpoints.serviceRequests,
        data
      );

      console.log('✅ Demande créée:', result);

      return {
        success: true,
        data: result,
        message: 'Demande enregistrée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      };
    }
  }

  async getAllRequests(): Promise<ServiceRequest[]> {
    try {
      return await apiClient.get<ServiceRequest[]>(
        API_CONFIG.endpoints.serviceRequests
      );
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return [];
    }
  }

  async getRequestById(id: string): Promise<ServiceRequest | null> {
    try {
      return await apiClient.get<ServiceRequest>(
        `${API_CONFIG.endpoints.serviceRequests}/${id}`
      );
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return null;
    }
  }

  async updateRequestStatus(
    id: string,
    status: ServiceRequest['status']
  ): Promise<ServiceRequestResponse> {
    try {
      const result = await apiClient.patch<ServiceRequest>(
        `${API_CONFIG.endpoints.serviceRequests}/${id}`,
        { status }
      );

      return {
        success: true,
        data: result,
        message: 'Statut mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      };
    }
  }

  async deleteRequest(id: string): Promise<ServiceRequestResponse> {
    try {
      await apiClient.delete(
        `${API_CONFIG.endpoints.serviceRequests}/${id}`
      );

      return {
        success: true,
        message: 'Demande supprimée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      };
    }
  }
}
```

## 🔐 Authentification (optionnel)

Si votre API nécessite une authentification :

### 1. Créer un service d'authentification

```typescript
// src/services/authService.ts
class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
}

export const authService = new AuthService();
```

### 2. Modifier le client API

```typescript
// Dans apiClient.ts
import { authService } from './authService';

class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authService.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    // ... reste du code
  }
}
```

## 📡 Format de l'API Backend

Votre API devrait renvoyer des réponses dans ce format :

### Succès

```json
{
  "id": "req_1234567890_abc",
  "serviceId": "repassage",
  "serviceName": "Repassage",
  "serviceSlug": "repassage",
  "lastName": "Dupont",
  "firstName": "Jean",
  "email": "jean.dupont@example.com",
  "phone": "06 12 34 56 78",
  "address": "123 rue de la Paix, 75001 Paris",
  "message": "Je souhaite un devis",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Erreur

```json
{
  "error": "Validation failed",
  "message": "L'email est invalide",
  "statusCode": 400
}
```

## 🧪 Tests

Testez votre intégration avec :

```javascript
// Dans la console du navigateur
await examples.createRequest();
await examples.getAllRequests();
```

## 🚨 Gestion des erreurs

Gérez les différents types d'erreurs :

```typescript
try {
  const response = await serviceRequestService.createServiceRequest(data);
  if (response.success) {
    // Succès
  } else {
    // Erreur métier
    console.error(response.error);
  }
} catch (error) {
  // Erreur réseau ou serveur
  console.error('Erreur inattendue:', error);
}
```

## 📊 Monitoring (recommandé)

Ajoutez du monitoring pour suivre les erreurs :

```typescript
// src/services/monitoring.ts
export const logError = (error: Error, context?: any) => {
  console.error('Error:', error);
  
  // Envoyer à un service de monitoring (Sentry, LogRocket, etc.)
  // Sentry.captureException(error, { extra: context });
};
```

## ✅ Checklist de migration

- [ ] Backend API créé et testé
- [ ] Variables d'environnement configurées
- [ ] Client API créé
- [ ] Service modifié pour utiliser l'API
- [ ] Gestion des erreurs implémentée
- [ ] Tests effectués
- [ ] (Optionnel) Authentification ajoutée
- [ ] (Optionnel) Monitoring configuré
- [ ] Documentation mise à jour

## 🔄 Rollback

Si vous devez revenir au localStorage :

1. Gardez une copie du code actuel
2. Ajoutez un flag de feature dans `.env` :

```typescript
const USE_API = import.meta.env.VITE_USE_API === 'true';

if (USE_API) {
  // Utiliser l'API
} else {
  // Utiliser localStorage
}
```

## 📞 Support

Pour toute question, consultez :
- Documentation de l'API backend
- `SERVICE_REQUESTS_README.md` pour la structure des données
- Exemples dans `src/examples/testServiceRequest.ts`
