# Correction de la politique RLS pour service_requests

## 🐛 Problème

Erreur lors de la soumission du formulaire :
```
"new row violates row-level security policy for table \"service_requests\""
```

## 🔍 Cause

La politique RLS utilisait `TO public` au lieu de `TO anon` pour les utilisateurs non authentifiés.

Dans Supabase :
- `anon` = utilisateurs non authentifiés (clé API anonyme)
- `authenticated` = utilisateurs connectés
- `public` = n'est pas reconnu dans ce contexte

## ✅ Solution

### Fichier corrigé
`supabase/migrations/20250713000000_create_service_requests.sql`

**Avant :**
```sql
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO public
    WITH CHECK (true);
```

**Après :**
```sql
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

## 🚀 Comment appliquer la correction

### Option 1 : Via Supabase CLI (recommandé)

```bash
# Réinitialiser la base de données
supabase db reset

# Ou appliquer uniquement les nouvelles migrations
supabase db push
```

### Option 2 : Via le Dashboard Supabase

1. Aller dans **SQL Editor**
2. Supprimer l'ancienne politique :
```sql
DROP POLICY IF EXISTS "Anyone can insert service requests" ON public.service_requests;
```

3. Créer la nouvelle politique :
```sql
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

4. Exécuter les deux commandes

### Option 3 : Recréer la table complètement

Si vous n'avez pas encore de données importantes :

```sql
-- Supprimer la table
DROP TABLE IF EXISTS public.service_requests CASCADE;

-- Puis exécuter tout le contenu du fichier de migration corrigé
```

## 🔐 Politiques RLS finales

Après correction, voici les politiques actives :

| Action | Rôle | Permission |
|--------|------|------------|
| **INSERT** | `anon` | ✅ Tout le monde peut créer |
| **SELECT** | `authenticated` | ✅ Admins peuvent lire |
| **UPDATE** | `authenticated` | ✅ Admins peuvent modifier |
| **DELETE** | `authenticated` | ✅ Admins peuvent supprimer |

## ✅ Vérification

### Tester l'insertion depuis le formulaire

1. Aller sur `/services/repassage` (ou n'importe quel service)
2. Remplir le formulaire
3. Soumettre
4. ✅ Devrait fonctionner sans erreur RLS

### Vérifier les politiques dans Supabase

1. Aller dans **Database** → **Tables** → `service_requests`
2. Cliquer sur **Policies**
3. Vérifier que la politique "Anyone can insert service requests" utilise le rôle `anon`

## 📊 Comprendre les rôles Supabase

### `anon` (anonyme)
- Utilisé par défaut pour toutes les requêtes non authentifiées
- Utilise la clé API `SUPABASE_ANON_KEY`
- Parfait pour les formulaires publics

### `authenticated` (authentifié)
- Utilisé après connexion avec `supabase.auth.signIn()`
- Accès aux données protégées
- Parfait pour les dashboards admin

### `service_role` (super admin)
- Bypass toutes les politiques RLS
- À utiliser uniquement côté serveur
- **Ne jamais exposer cette clé côté client**

## 🎯 Bonnes pratiques

### Pour les formulaires publics
```typescript
// ✅ Utilise automatiquement le rôle 'anon'
const { data, error } = await supabase
  .from('service_requests')
  .insert([{ ... }]);
```

### Pour les opérations admin
```typescript
// ✅ Nécessite d'être authentifié
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  // Utilise automatiquement le rôle 'authenticated'
  const { data, error } = await supabase
    .from('service_requests')
    .select('*');
}
```

## 🔧 Dépannage

### L'erreur persiste après correction

1. **Vider le cache du navigateur**
2. **Vérifier que la migration est bien appliquée** :
```sql
SELECT * FROM pg_policies WHERE tablename = 'service_requests';
```

3. **Vérifier les variables d'environnement** :
```bash
# .env.local
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

4. **Redémarrer le serveur de développement** :
```bash
npm run dev
```

### Tester manuellement dans le SQL Editor

```sql
-- Se connecter en tant qu'utilisateur anonyme
SET ROLE anon;

-- Tester l'insertion
INSERT INTO public.service_requests (
  service_id,
  service_name,
  service_slug,
  last_name,
  first_name,
  email,
  phone,
  status
) VALUES (
  'test',
  'Test Service',
  'test-service',
  'Doe',
  'John',
  'john@example.com',
  '0123456789',
  'pending'
);

-- Si ça fonctionne, la politique est correcte ✅
```

## 📚 Ressources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- [Supabase Auth Roles](https://supabase.com/docs/guides/auth/managing-user-data)

## ✨ Résumé

- ✅ Changé `TO public` → `TO anon`
- ✅ Les formulaires publics peuvent maintenant insérer des données
- ✅ Les admins authentifiés gardent leurs permissions
- ✅ La sécurité est maintenue (lecture/modification/suppression protégées)
