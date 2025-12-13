# Système de Gestion des Demandes de Service

## 📋 Vue d'ensemble

Ce système gère les demandes d'intérêt pour les services de conciergerie. Il est actuellement configuré pour stocker les données dans le **localStorage** du navigateur, mais l'architecture est prête pour une connexion API future.

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── types/
│   └── serviceRequest.ts          # Types TypeScript pour les demandes
├── services/
│   └── serviceRequestService.ts   # Service de gestion des demandes
├── pages/
│   └── ServiceDetailPage.tsx      # Page avec formulaire de soumission
└── utils/
    └── devTools.ts                # Outils de développement
```

### Types de données

```typescript
interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

## 💾 Stockage actuel (localStorage)

Les données sont stockées dans le localStorage sous la clé `concierge_service_requests`.

### Avantages
- ✅ Pas besoin de backend pour tester
- ✅ Données persistantes entre les sessions
- ✅ Facile à débugger

### Limitations
- ⚠️ Données locales au navigateur (pas synchronisées)
- ⚠️ Limite de ~5-10 MB selon le navigateur
- ⚠️ Peut être effacé par l'utilisateur

## 🔌 Migration vers une API

Le code est structuré pour faciliter la migration vers une vraie API. Voici comment procéder :

### 1. Configuration de l'endpoint API

Dans `src/services/serviceRequestService.ts`, modifiez la constante :

```typescript
const API_ENDPOINT = 'https://votre-api.com/api/service-requests';
```

### 2. Décommenter les appels API

Remplacez les sections marquées `TODO` par les vrais appels API :

```typescript
// Exemple pour createServiceRequest
async createServiceRequest(data: CreateServiceRequestDTO): Promise<ServiceRequestResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez vos headers d'authentification si nécessaire
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Erreur réseau');
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: 'Demande enregistrée avec succès'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Une erreur est survenue'
    };
  }
}
```

### 3. Backend attendu

Votre API devrait exposer ces endpoints :

```
POST   /api/service-requests          # Créer une demande
GET    /api/service-requests          # Lister toutes les demandes
GET    /api/service-requests/:id      # Récupérer une demande
PATCH  /api/service-requests/:id      # Mettre à jour une demande
DELETE /api/service-requests/:id      # Supprimer une demande
```

## 🛠️ Outils de développement

Des outils sont disponibles dans la console du navigateur (mode développement uniquement) :

```javascript
// Afficher toutes les demandes
await devTools.logAllRequests();

// Afficher les détails d'une demande
await devTools.logRequestDetails('req_123456789_abc');

// Afficher les statistiques
await devTools.showRequestStats();

// Exporter toutes les demandes en JSON
devTools.exportRequests();

// Supprimer toutes les demandes (ATTENTION: irréversible)
devTools.clearAllRequests();

// Accès direct au service
devTools.serviceRequestService.getAllRequests();
```

## 📊 Utilisation

### Soumettre une demande

```typescript
import { serviceRequestService } from './services/serviceRequestService';

const response = await serviceRequestService.createServiceRequest({
  serviceId: 'repassage',
  serviceName: 'Repassage',
  serviceSlug: 'repassage',
  lastName: 'Dupont',
  firstName: 'Jean',
  email: 'jean.dupont@example.com',
  phone: '06 12 34 56 78',
  address: '123 rue de la Paix, 75001 Paris',
  message: 'Je souhaite un devis'
});

if (response.success) {
  console.log('Demande créée:', response.data);
} else {
  console.error('Erreur:', response.error);
}
```

### Récupérer toutes les demandes

```typescript
const requests = await serviceRequestService.getAllRequests();
console.log(`${requests.length} demande(s) trouvée(s)`);
```

### Mettre à jour le statut

```typescript
await serviceRequestService.updateRequestStatus('req_123', 'contacted');
```

## 🔒 Sécurité

### Pour la production

Quand vous migrerez vers une API, pensez à :

1. **Authentification** : Ajouter des tokens JWT ou OAuth
2. **Validation côté serveur** : Ne jamais faire confiance aux données client
3. **Rate limiting** : Limiter le nombre de requêtes par IP
4. **HTTPS** : Toujours utiliser HTTPS en production
5. **CORS** : Configurer correctement les origines autorisées
6. **Sanitization** : Nettoyer les données pour éviter les injections

## 📝 Logs et Debug

Le service log automatiquement dans la console :

- ✅ Succès : `📝 Nouvelle demande de service:`
- ❌ Erreur : `❌ Erreur lors de la soumission:`

## 🚀 Prochaines étapes

1. **Backend** : Créer une API REST ou GraphQL
2. **Base de données** : PostgreSQL, MongoDB, ou autre
3. **Notifications** : Envoyer des emails de confirmation
4. **Dashboard admin** : Interface pour gérer les demandes
5. **Webhooks** : Notifier d'autres systèmes
6. **Analytics** : Suivre les conversions et statistiques

## 📞 Support

Pour toute question sur l'implémentation, consultez :
- `src/services/serviceRequestService.ts` - Service principal
- `src/types/serviceRequest.ts` - Définitions TypeScript
- `src/utils/devTools.ts` - Outils de debug
