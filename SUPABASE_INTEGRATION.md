# Intégration Supabase pour les Services de Conciergerie

## ✅ Ce qui a été implémenté

### 1. Migration SQL
**Fichier**: `supabase/migrations/20250713000000_create_service_requests.sql`

La table `service_requests` a été créée avec:
- Tous les champs nécessaires (nom, prénom, email, téléphone, adresse, message, etc.)
- Index pour optimiser les requêtes
- Row Level Security (RLS) configuré
- Politiques d'accès:
  - **INSERT**: Public (pour les formulaires)
  - **SELECT/UPDATE/DELETE**: Authentifié uniquement (admin)

### 2. Service Supabase
**Fichier**: `src/services/serviceRequestServiceSupabase.ts`

Service complet qui remplace localStorage par Supabase:
- ✅ `createServiceRequest()` - Créer une demande
- ✅ `getAllRequests()` - Récupérer toutes les demandes (admin)
- ✅ `getRequestById()` - Récupérer une demande par ID
- ✅ `updateRequestStatus()` - Mettre à jour le statut
- ✅ `deleteRequest()` - Supprimer une demande
- ✅ `getStatistics()` - Statistiques des demandes
- ✅ `exportRequests()` - Exporter en JSON

### 3. Interface Admin
**Fichier**: `src/components/ServiceRequestsAdmin.tsx`

Interface complète pour gérer les demandes:
- 📊 Statistiques (total, par statut, récentes)
- 🔍 Recherche et filtres
- 📋 Liste des demandes en tableau
- 👁️ Vue détaillée de chaque demande
- ✏️ Changement de statut
- 📥 Export des données

### 4. Types TypeScript
**Fichier**: `src/lib/supabase.ts`

Type `ServiceRequestDB` ajouté pour la table Supabase.

## 🚀 Étapes pour activer l'intégration

### Étape 1: Exécuter la migration SQL

```bash
# Option A: Via Supabase CLI
supabase db push

# Option B: Via le Dashboard Supabase
# 1. Aller sur https://supabase.com/dashboard
# 2. Sélectionner votre projet
# 3. Aller dans "SQL Editor"
# 4. Copier le contenu de supabase/migrations/20250713000000_create_service_requests.sql
# 5. Exécuter la requête
```

### Étape 2: Vérifier la table

Dans le Dashboard Supabase, vérifier que la table `service_requests` existe avec:
- Toutes les colonnes
- Les index
- Les politiques RLS

### Étape 3: Intégrer l'interface admin

Le composant `ServiceRequestsAdmin` doit être ajouté au `AdminDashboard`.

**Modifier `src/components/AdminDashboard.tsx`** pour ajouter un système d'onglets:

```typescript
import { ServiceRequestsAdmin } from './ServiceRequestsAdmin';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'conciergerie'>('forum');
  
  // ... reste du code ...
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header existant */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('forum')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'forum'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Forum des Services
              </button>
              <button
                onClick={() => setActiveTab('conciergerie')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'conciergerie'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Services de Conciergerie
              </button>
            </nav>
          </div>
        </div>

        {/* Afficher le contenu selon l'onglet */}
        {activeTab === 'conciergerie' ? (
          <ServiceRequestsAdmin />
        ) : (
          // Contenu existant du forum
          <>
            {/* Statistiques, filtres, liste des contacts... */}
          </>
        )}
      </div>
    </div>
  );
};
```

### Étape 4: Tester l'intégration

1. **Soumettre une demande**:
   - Aller sur `/services/repassage` (ou n'importe quel service)
   - Remplir le formulaire
   - Vérifier que la demande apparaît dans Supabase

2. **Vérifier dans l'admin**:
   - Se connecter en tant qu'admin
   - Aller dans l'onglet "Services de Conciergerie"
   - Vérifier que les demandes s'affichent
   - Tester le changement de statut
   - Tester l'export

## 📊 Structure de la table

```sql
service_requests (
  id UUID PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

## 🔒 Sécurité

### Politiques RLS configurées

1. **INSERT (Public)**: Tout le monde peut créer une demande
2. **SELECT (Authenticated)**: Seuls les admins peuvent lire
3. **UPDATE (Authenticated)**: Seuls les admins peuvent modifier
4. **DELETE (Authenticated)**: Seuls les admins peuvent supprimer

### Authentification requise

Pour accéder aux demandes, l'utilisateur doit être authentifié via Supabase Auth.

## 📝 Utilisation

### Pour les utilisateurs (formulaire public)

```typescript
// Le formulaire utilise automatiquement Supabase
// Aucune configuration supplémentaire nécessaire
```

### Pour les administrateurs

```typescript
// Dans le dashboard admin, toutes les fonctionnalités sont disponibles:
// - Voir toutes les demandes
// - Filtrer par statut
// - Rechercher
// - Changer le statut
// - Exporter les données
```

## 🐛 Dépannage

### La table n'existe pas
```bash
# Vérifier les migrations
supabase db reset

# Ou exécuter manuellement la migration
supabase db push
```

### Erreur de permissions
- Vérifier que RLS est activé
- Vérifier les politiques d'accès
- Vérifier que l'utilisateur est authentifié

### Les demandes ne s'affichent pas
- Vérifier la console du navigateur pour les erreurs
- Vérifier que la table contient des données
- Vérifier les politiques RLS

## 📈 Prochaines étapes

1. ✅ Migration SQL créée
2. ✅ Service Supabase implémenté
3. ✅ Interface admin créée
4. ⏳ Intégrer l'interface dans AdminDashboard (voir Étape 3)
5. ⏳ Tester l'intégration complète
6. 🔜 Ajouter des notifications email (optionnel)
7. 🔜 Ajouter des webhooks (optionnel)

## 💡 Fonctionnalités futures

- Notifications email automatiques
- Webhooks pour intégration avec d'autres systèmes
- Dashboard de statistiques avancées
- Export en CSV/Excel
- Filtres avancés
- Historique des modifications

## 📞 Support

Pour toute question:
1. Vérifier la documentation Supabase
2. Consulter les logs dans la console
3. Vérifier les politiques RLS dans le Dashboard Supabase
