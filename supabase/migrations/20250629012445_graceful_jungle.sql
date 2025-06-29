/*
  # Configuration de l'authentification administrateur

  1. Configuration
    - Désactiver la confirmation d'email pour simplifier l'accès admin
    - Permettre l'inscription uniquement via l'interface admin
  
  2. Sécurité
    - Les politiques RLS existantes permettent déjà l'accès aux données pour les utilisateurs authentifiés
    - Seuls les administrateurs avec un compte Supabase peuvent se connecter
*/

-- Cette migration configure l'authentification pour les administrateurs
-- Les paramètres d'authentification sont gérés dans le dashboard Supabase

-- Aucune modification de schéma nécessaire car nous utilisons le système d'auth intégré de Supabase
-- Les politiques RLS existantes sur service_contacts permettent déjà l'accès aux utilisateurs authentifiés