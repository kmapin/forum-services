-- ============================================================================
-- CONFIGURATION DES PROFILS UTILISATEURS POUR CHURCHAPP
-- ============================================================================
-- Ce script configure la table profiles et les règles de sécurité nécessaires
-- pour le système de rôles et d'authentification
-- ============================================================================

-- 1. CRÉATION DE LA TABLE PROFILES (si elle n'existe pas)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'pastor', 'lead', 'admin')),
  service TEXT, -- Pour les 'lead': quel service ils dirigent (ex: 'youth', 'worship', etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INDEX POUR AMÉLIORER LES PERFORMANCES
-- ============================================================================

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_service_idx ON public.profiles(service);

-- 3. FONCTION POUR METTRE À JOUR updated_at AUTOMATIQUEMENT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. FONCTION POUR CRÉER AUTOMATIQUEMENT LE PROFIL APRÈS INSCRIPTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'member' -- Rôle par défaut
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne bloque pas l'inscription
    RAISE WARNING 'Erreur lors de la création du profil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. RÈGLES DE SÉCURITÉ (RLS - Row Level Security)
-- ============================================================================

-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Pastors can read all profiles" ON public.profiles;

-- Policy 1: Les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Les utilisateurs peuvent mettre à jour leur propre profil (sauf le rôle)
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Policy 3: Les admins peuvent lire tous les profils
CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 4: Les admins peuvent mettre à jour tous les profils
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 5: Les pasteurs peuvent lire tous les profils
CREATE POLICY "Pastors can read all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('pastor', 'admin')
  )
);

-- Policy 6: Les pasteurs peuvent mettre à jour les profils (sauf créer des admins)
CREATE POLICY "Pastors can update profiles"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('pastor', 'admin')
  )
)
WITH CHECK (
  -- Les pasteurs ne peuvent pas créer d'admins
  CASE 
    WHEN (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'pastor' 
    THEN role != 'admin'
    ELSE true
  END
);

-- 6. FONCTION UTILITAIRE POUR CHANGER LE RÔLE D'UN UTILISATEUR
-- ============================================================================
-- Seuls les admins peuvent utiliser cette fonction

CREATE OR REPLACE FUNCTION public.change_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Vérifier que l'utilisateur actuel est admin
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Seuls les administrateurs peuvent changer les rôles';
  END IF;

  -- Vérifier que le nouveau rôle est valide
  IF new_role NOT IN ('member', 'pastor', 'lead', 'admin') THEN
    RAISE EXCEPTION 'Rôle invalide: %', new_role;
  END IF;

  -- Mettre à jour le rôle
  UPDATE public.profiles
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. FONCTION POUR OBTENIR LES STATISTIQUES DES RÔLES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_role_statistics()
RETURNS TABLE (
  role TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.role,
    COUNT(*)::BIGINT
  FROM public.profiles p
  GROUP BY p.role
  ORDER BY p.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. DONNÉES DE TEST (OPTIONNEL - À COMMENTER EN PRODUCTION)
-- ============================================================================

-- Créer un utilisateur admin de test (décommenter si nécessaire)
/*
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@churchapp.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Créer le profil admin correspondant
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Admin Test', 'admin'
FROM auth.users
WHERE email = 'admin@churchapp.com'
ON CONFLICT (id) DO NOTHING;
*/

-- 9. VÉRIFICATION DE LA CONFIGURATION
-- ============================================================================

-- Afficher toutes les policies sur la table profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Afficher le nombre de profils par rôle
SELECT role, COUNT(*) as count
FROM public.profiles
GROUP BY role
ORDER BY role;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

-- NOTES D'UTILISATION:
-- 1. Exécuter ce script dans l'éditeur SQL de Supabase
-- 2. Vérifier que toutes les commandes s'exécutent sans erreur
-- 3. Tester la création d'un nouveau compte pour vérifier le trigger
-- 4. Vérifier les permissions en se connectant avec différents rôles

-- COMMANDES UTILES POUR LE DEBUG:
-- 
-- Voir tous les profils:
-- SELECT * FROM public.profiles;
--
-- Voir un profil spécifique:
-- SELECT * FROM public.profiles WHERE id = 'user-id-here';
--
-- Changer le rôle d'un utilisateur (en tant qu'admin):
-- SELECT public.change_user_role('user-id-here', 'admin');
--
-- Voir les statistiques des rôles:
-- SELECT * FROM public.get_role_statistics();
