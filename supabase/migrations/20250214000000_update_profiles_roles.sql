-- ============================================
-- MISE À JOUR DES RÔLES UTILISATEURS
-- ============================================

-- Supprimer toutes les contraintes possibles sur le rôle
DO $$ 
BEGIN
  -- Supprimer la contrainte profiles_role_check si elle existe
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_role_check' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
  END IF;
  
  -- Supprimer la contrainte valid_roles si elle existe
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_roles' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT valid_roles;
  END IF;
END $$;

-- Ajouter une nouvelle contrainte avec plus de rôles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('member', 'admin', 'pastor', 'lead', 'teacher', 'moderator'));

-- Ajouter une politique pour permettre aux admins de modifier tous les profils
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Ajouter la colonne email si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Ajouter la colonne avatar_url si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Mettre à jour la fonction handle_new_user pour inclure l'email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'member'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Synchroniser les emails existants depuis auth.users vers profiles
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- Créer une fonction pour récupérer les profils avec les emails depuis auth.users
CREATE OR REPLACE FUNCTION get_profiles_with_emails()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    COALESCE(p.email, u.email) as email,
    p.avatar_url,
    p.role,
    p.created_at,
    p.updated_at
  FROM profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  ORDER BY p.created_at DESC;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION get_profiles_with_emails() TO authenticated;

-- Activer l'extension pgcrypto si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Créer une fonction pour permettre aux admins/pastors de changer le mot de passe d'un utilisateur
CREATE OR REPLACE FUNCTION admin_reset_user_password(
  target_user_id UUID,
  new_password TEXT
)
RETURNS JSON
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_role TEXT;
  result JSON;
  encrypted_pw TEXT;
BEGIN
  -- Vérifier que l'utilisateur actuel est admin ou pastor
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF current_user_role IS NULL OR current_user_role NOT IN ('admin', 'pastor') THEN
    RAISE EXCEPTION 'Seuls les administrateurs et pasteurs peuvent réinitialiser les mots de passe';
  END IF;

  -- Vérifier que le mot de passe a au moins 6 caractères
  IF LENGTH(new_password) < 6 THEN
    RAISE EXCEPTION 'Le mot de passe doit contenir au moins 6 caractères';
  END IF;

  -- Crypter le mot de passe avec bcrypt
  encrypted_pw := crypt(new_password, gen_salt('bf'));

  -- Mettre à jour le mot de passe dans auth.users
  UPDATE auth.users
  SET 
    encrypted_password = encrypted_pw,
    updated_at = NOW()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Utilisateur non trouvé';
  END IF;

  result := json_build_object(
    'success', true,
    'message', 'Mot de passe réinitialisé avec succès'
  );

  RETURN result;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION admin_reset_user_password(UUID, TEXT) TO authenticated;
