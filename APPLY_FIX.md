# Comment appliquer la correction RLS

## ⚠️ Problème avec le script initial

Le script `20250713000000_create_service_requests.sql` a **déjà été exécuté** sur votre base de données.

Si vous le réexécutez :
- ✅ Les `CREATE TABLE IF NOT EXISTS` passeront (table existe déjà)
- ✅ Les `CREATE INDEX IF NOT EXISTS` passeront (index existent déjà)
- ✅ Les `DROP TRIGGER IF EXISTS` passeront
- ❌ Les `CREATE POLICY` **échoueront** car les politiques existent déjà et n'ont pas de `IF NOT EXISTS`

## ✅ Solution : Migration de correction

J'ai créé une **nouvelle migration** qui corrige uniquement le problème :

**Fichier** : `supabase/migrations/20250713000001_fix_service_requests_rls.sql`

Cette migration :
1. Supprime l'ancienne politique (avec `DROP POLICY IF EXISTS`)
2. Recrée la politique avec le bon rôle (`anon` au lieu de `public`)

## 🚀 Comment appliquer la correction

### Option 1 : Via Supabase CLI (recommandé)

```bash
# Appliquer toutes les nouvelles migrations
supabase db push
```

La CLI détectera automatiquement la nouvelle migration `20250713000001_fix_service_requests_rls.sql` et l'appliquera.

### Option 2 : Via le Dashboard Supabase (manuel)

1. Aller dans **SQL Editor**
2. Copier-coller le contenu de `20250713000001_fix_service_requests_rls.sql` :

```sql
DROP POLICY IF EXISTS "Anyone can insert service requests" ON public.service_requests;

CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

3. Cliquer sur **Run** ou **Ctrl+Enter**
4. ✅ Devrait afficher "Success. No rows returned"

### Option 3 : Reset complet (si pas de données importantes)

```bash
# ⚠️ ATTENTION : Supprime toutes les données !
supabase db reset
```

Cela réexécutera toutes les migrations dans l'ordre, y compris la version corrigée.

## 🔍 Vérifier que la correction est appliquée

### Via SQL Editor

```sql
-- Vérifier les politiques actuelles
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'service_requests';
```

**Résultat attendu** :
| policyname | roles | cmd |
|------------|-------|-----|
| Anyone can insert service requests | {anon} | INSERT |
| Authenticated users can read service requests | {authenticated} | SELECT |
| Authenticated users can update service requests | {authenticated} | UPDATE |
| Authenticated users can delete service requests | {authenticated} | DELETE |

### Via le Dashboard

1. **Database** → **Tables** → `service_requests`
2. Onglet **Policies**
3. Vérifier que "Anyone can insert service requests" utilise le rôle `anon`

## ✅ Test fonctionnel

### Tester l'insertion depuis l'application

1. Aller sur `http://localhost:5173/services/repassage`
2. Remplir le formulaire
3. Soumettre
4. ✅ Devrait fonctionner sans erreur RLS

### Tester manuellement dans SQL Editor

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
  'test-' || gen_random_uuid(),
  'Test Service',
  'test-service',
  'Doe',
  'John',
  'test@example.com',
  '0123456789',
  'pending'
);

-- Revenir au rôle normal
RESET ROLE;

-- Vérifier que l'insertion a fonctionné
SELECT * FROM public.service_requests WHERE email = 'test@example.com';

-- Nettoyer le test
DELETE FROM public.service_requests WHERE email = 'test@example.com';
```

Si l'insertion fonctionne, la politique est correcte ! ✅

## 📋 Résumé des fichiers

| Fichier | État | Action |
|---------|------|--------|
| `20250713000000_create_service_requests.sql` | ❌ Erreur (TO public) | Modifié mais ne pas réexécuter |
| `20250713000001_fix_service_requests_rls.sql` | ✅ Nouveau | **À exécuter** |

## 🎯 Ordre d'exécution recommandé

1. ✅ **Ne pas** réexécuter `20250713000000_create_service_requests.sql`
2. ✅ **Exécuter** `20250713000001_fix_service_requests_rls.sql` via `supabase db push`
3. ✅ **Tester** le formulaire de demande de service
4. ✅ **Vérifier** les politiques dans le Dashboard

## 💡 Pourquoi cette approche ?

- ✅ **Sûre** : Ne touche pas à la structure de la table
- ✅ **Ciblée** : Corrige uniquement le problème RLS
- ✅ **Réversible** : Peut être annulée facilement
- ✅ **Traçable** : Nouvelle migration dans l'historique
- ✅ **Idempotente** : Peut être réexécutée sans problème

## 🔧 En cas de problème

### Si la politique existe toujours avec 'public'

```sql
-- Forcer la suppression
DROP POLICY "Anyone can insert service requests" ON public.service_requests;

-- Recréer avec anon
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

### Si vous voulez tout recommencer

```bash
# Supprimer la table et tout recommencer
supabase db reset
```

Puis modifier `20250713000000_create_service_requests.sql` pour avoir `TO anon` dès le départ.

## ✨ Après la correction

Une fois la correction appliquée :
- ✅ Les formulaires publics fonctionneront
- ✅ Les admins pourront gérer les demandes
- ✅ La sécurité sera maintenue
- ✅ Plus d'erreur RLS !
