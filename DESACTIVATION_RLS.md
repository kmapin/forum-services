# ⚠️ Désactivation RLS - Service Requests

## 🚨 ATTENTION

La désactivation de Row Level Security (RLS) **supprime toute la sécurité** de la table `service_requests`.

### Conséquences

Avec RLS désactivé, **n'importe qui** peut :
- ✅ Insérer des données (INSERT)
- ✅ Lire toutes les données (SELECT)
- ✅ Modifier toutes les données (UPDATE)
- ✅ Supprimer toutes les données (DELETE)

## 🎯 Quand utiliser cette approche

### ✅ Acceptable en développement
- Environnement local uniquement
- Tests et prototypage rapide
- Pas de données sensibles

### ❌ À ÉVITER en production
- Données personnelles (emails, téléphones, adresses)
- Informations sensibles
- Application publique

## 🚀 Appliquer la désactivation

### Option 1 : Via Supabase CLI

```bash
supabase db push
```

### Option 2 : Via Dashboard Supabase

1. Aller dans **SQL Editor**
2. Copier-coller :

```sql
-- Supprimer toutes les politiques
DROP POLICY IF EXISTS "Anyone can insert service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can read service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can update service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can delete service requests" ON public.service_requests;

-- Désactiver RLS
ALTER TABLE public.service_requests DISABLE ROW LEVEL SECURITY;
```

3. Cliquer sur **Run**

## ✅ Vérification

### Vérifier que RLS est désactivé

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'service_requests';
```

**Résultat attendu** :
| schemaname | tablename | rowsecurity |
|------------|-----------|-------------|
| public | service_requests | false |

### Vérifier qu'il n'y a plus de politiques

```sql
SELECT * FROM pg_policies WHERE tablename = 'service_requests';
```

**Résultat attendu** : Aucune ligne (table vide)

## 🔄 Réactiver RLS plus tard

Si vous voulez réactiver la sécurité :

```sql
-- Réactiver RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Recréer les politiques
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Authenticated users can read service requests"
    ON public.service_requests
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update service requests"
    ON public.service_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete service requests"
    ON public.service_requests
    FOR DELETE
    TO authenticated
    USING (true);
```

## 💡 Alternative : RLS avec politiques permissives

Au lieu de désactiver complètement RLS, vous pouvez créer des politiques très permissives :

```sql
-- Activer RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Politique permissive pour tout le monde
CREATE POLICY "Allow all operations"
    ON public.service_requests
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
```

Cette approche :
- ✅ Garde RLS activé (meilleure pratique)
- ✅ Permet toutes les opérations
- ✅ Plus facile à restreindre plus tard

## 🎯 Recommandations

### Pour le développement local

**Option A : Désactiver RLS** (plus simple)
```sql
ALTER TABLE public.service_requests DISABLE ROW LEVEL SECURITY;
```

**Option B : Politique permissive** (meilleure pratique)
```sql
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dev - Allow all"
    ON public.service_requests
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

### Pour la production

**Toujours utiliser RLS avec des politiques strictes** :
- INSERT : `anon` uniquement
- SELECT/UPDATE/DELETE : `authenticated` uniquement

## 📊 Comparaison des approches

| Approche | Sécurité | Simplicité | Production |
|----------|----------|------------|------------|
| **RLS désactivé** | ❌ Aucune | ✅ Très simple | ❌ Non |
| **RLS + politique permissive** | ⚠️ Minimale | ✅ Simple | ⚠️ Déconseillé |
| **RLS + politiques strictes** | ✅ Maximale | ⚠️ Plus complexe | ✅ Oui |

## 🔧 Dépannage

### Le formulaire fonctionne mais l'admin ne peut pas lire

Si RLS est désactivé, tout devrait fonctionner. Si ce n'est pas le cas :

1. Vérifier que RLS est bien désactivé
2. Vérifier les permissions de la table
3. Vérifier la connexion Supabase

### Erreur "permission denied"

```sql
-- Donner toutes les permissions
GRANT ALL ON public.service_requests TO anon;
GRANT ALL ON public.service_requests TO authenticated;
```

## ✨ Résumé

- ✅ **Fichier créé** : `20250713000002_disable_rls_service_requests.sql`
- ⚠️ **Attention** : Supprime toute la sécurité RLS
- 🎯 **Usage** : Développement local uniquement
- 🔒 **Production** : Toujours utiliser RLS avec politiques strictes

## 📞 Prochaines étapes

1. Appliquer la migration (`supabase db push` ou via Dashboard)
2. Tester le formulaire → Devrait fonctionner
3. Tester le dashboard admin → Devrait fonctionner
4. **Avant la production** : Réactiver RLS avec politiques strictes
