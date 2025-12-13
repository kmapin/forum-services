# ⚠️ Correction Immédiate - Erreur RLS

## 🐛 Erreur actuelle

```
Erreur Supabase lors de l'insertion:
{code: "42501", details: null, hint: null, message: "new row violates row-level security policy for table \"service_requests\""}

Erreur lors de la soumission: Erreur lors de l'enregistrement de votre demande
```

## 🔧 Solution Rapide

### Option 1 : Via le Dashboard Supabase (RECOMMANDÉ - 2 minutes)

1. **Aller sur** : https://supabase.com/dashboard
2. **Sélectionner votre projet**
3. **Aller dans** : SQL Editor (menu de gauche)
4. **Copier-coller ce code** :

```sql
-- Supprimer l'ancienne politique incorrecte
DROP POLICY IF EXISTS "Anyone can insert service requests" ON public.service_requests;

-- Créer la nouvelle politique avec le bon rôle
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

5. **Cliquer sur** : Run (ou Ctrl+Enter)
6. **Vérifier** : Devrait afficher "Success. No rows returned"
7. **Tester** : Retourner sur votre formulaire et soumettre à nouveau

### Option 2 : Via Supabase CLI

```bash
# Dans le terminal, à la racine du projet
supabase db push
```

Cette commande appliquera automatiquement la migration `20250713000001_fix_service_requests_rls.sql`.

## ✅ Vérification

### Tester que ça fonctionne

1. Aller sur : `http://localhost:5173/services/repassage`
2. Remplir le formulaire :
   - Nom : Test
   - Prénom : User
   - Email : test@example.com
   - Téléphone : 0123456789
   - Message : Test de la correction
3. Cliquer sur "Envoyer ma demande"
4. ✅ Devrait afficher : "Demande envoyée avec succès ! 🎉"

### Vérifier dans Supabase

1. Aller dans : **Table Editor** → `service_requests`
2. Vérifier qu'une nouvelle ligne apparaît avec vos données de test

## 🔍 Comprendre le problème

### Ce qui ne fonctionnait pas

```sql
-- ❌ INCORRECT
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO public    -- ← Ce rôle n'existe pas dans Supabase
    WITH CHECK (true);
```

### Ce qui fonctionne maintenant

```sql
-- ✅ CORRECT
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon      -- ← Rôle pour les utilisateurs non authentifiés
    WITH CHECK (true);
```

## 📊 Rôles Supabase

| Rôle | Utilisation | Contexte |
|------|-------------|----------|
| `anon` | Utilisateurs non connectés | Formulaires publics |
| `authenticated` | Utilisateurs connectés | Dashboards admin |
| `service_role` | Super admin (backend) | Ne jamais exposer côté client |

## 🚨 Si l'erreur persiste

### 1. Vérifier que la politique est bien créée

```sql
-- Dans SQL Editor
SELECT 
    policyname,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'service_requests' 
  AND policyname = 'Anyone can insert service requests';
```

**Résultat attendu** :
| policyname | roles | cmd |
|------------|-------|-----|
| Anyone can insert service requests | {anon} | INSERT |

### 2. Vérifier les variables d'environnement

Dans votre fichier `.env.local` :

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-key-ici
```

### 3. Redémarrer le serveur de développement

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

### 4. Vider le cache du navigateur

- Chrome/Edge : Ctrl+Shift+Delete
- Firefox : Ctrl+Shift+Delete
- Ou utiliser le mode navigation privée

## 🎯 Checklist de correction

- [ ] Exécuter le SQL de correction dans le Dashboard Supabase
- [ ] Vérifier que la politique utilise le rôle `anon`
- [ ] Redémarrer le serveur de développement
- [ ] Tester le formulaire
- [ ] Vérifier dans la table que les données sont insérées

## 💡 Prévention future

Pour éviter ce problème à l'avenir :

1. **Toujours tester les migrations** dans un environnement de dev d'abord
2. **Vérifier les politiques RLS** après chaque migration
3. **Utiliser `anon` pour les accès publics**, pas `public`
4. **Documenter les rôles** utilisés dans chaque politique

## 📞 Support

Si le problème persiste après avoir suivi ces étapes :

1. Vérifier les logs Supabase : Dashboard → Logs
2. Vérifier la console du navigateur (F12)
3. Vérifier que la table `service_requests` existe bien
4. Vérifier que RLS est activé sur la table

## ✨ Après la correction

Une fois la correction appliquée, vous pourrez :
- ✅ Soumettre des demandes depuis les formulaires publics
- ✅ Les jeunes pourront gérer les demandes dans leur dashboard
- ✅ Les données seront sécurisées (lecture/modification réservées aux admins)
- ✅ Tout fonctionnera comme prévu ! 🎉
