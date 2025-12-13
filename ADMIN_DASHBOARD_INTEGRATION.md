# Intégration de l'onglet Conciergerie dans AdminDashboard

## Modifications à apporter au fichier `src/components/AdminDashboard.tsx`

### 1. Ajouter les imports (lignes 2 et 5)

```typescript
// Ligne 2 - Ajouter Briefcase à la liste des imports
import { LogOut, Users, Mail, Phone, Calendar, User, MessageSquare, Filter, Download, Search, Briefcase } from 'lucide-react';

// Ligne 5 - Ajouter après les imports existants
import { ServiceRequestsAdmin } from './ServiceRequestsAdmin';
```

### 2. Ajouter l'état activeTab (ligne 12)

```typescript
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'conciergerie'>('forum');
  const [contacts, setContacts] = useState<ServiceContact[]>([]);
  // ... reste du code
```

### 3. Ajouter les onglets après le header (après la ligne 172)

Remplacer:
```typescript
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques globales */}
```

Par:
```typescript
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('forum')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'forum'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline mr-2" size={18} />
                Forum des Services
              </button>
              <button
                onClick={() => setActiveTab('conciergerie')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'conciergerie'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase className="inline mr-2" size={18} />
                Services de Conciergerie
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'conciergerie' ? (
          <ServiceRequestsAdmin />
        ) : (
          <>
            {/* Statistiques globales */}
```

### 4. Fermer le fragment JSX à la fin (avant les 3 dernières lignes `</div>`)

Ajouter `</>` juste avant les 3 derniers `</div>`:

```typescript
            </div>
          )}
        </div>
          </>  {/* <-- AJOUTER CETTE LIGNE */}
      </div>
    </div>
  );
};
```

## Résultat attendu

Après ces modifications:
1. Le dashboard admin aura deux onglets: "Forum des Services" et "Services de Conciergerie"
2. L'onglet "Forum des Services" affichera le contenu existant
3. L'onglet "Services de Conciergerie" affichera le composant `ServiceRequestsAdmin`
4. Les onglets seront stylisés avec une indication visuelle de l'onglet actif

## Test

1. Se connecter en tant qu'admin
2. Vérifier que les deux onglets sont visibles
3. Cliquer sur "Services de Conciergerie"
4. Vérifier que l'interface des demandes de conciergerie s'affiche
5. Revenir à "Forum des Services" pour voir les inscriptions du forum
