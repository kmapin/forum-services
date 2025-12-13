-- Migration pour désactiver RLS sur service_requests
-- Date: 2025-07-13
-- ATTENTION : Cette migration désactive complètement la sécurité RLS
-- À utiliser uniquement en développement ou si vous gérez la sécurité autrement

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Anyone can insert service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can read service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can update service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can delete service requests" ON public.service_requests;

-- Désactiver Row Level Security sur la table
ALTER TABLE public.service_requests DISABLE ROW LEVEL SECURITY;

-- Note : Avec RLS désactivé, TOUTES les opérations sont permises
-- Cela signifie que n'importe qui peut :
-- - Insérer des données (INSERT)
-- - Lire les données (SELECT)
-- - Modifier les données (UPDATE)
-- - Supprimer les données (DELETE)
