-- Migration pour corriger les politiques RLS de service_requests
-- Date: 2025-07-13 (correction)
-- Cette migration corrige le rôle 'public' en 'anon' pour permettre les insertions publiques

-- Supprimer l'ancienne politique d'insertion (si elle existe)
DROP POLICY IF EXISTS "Anyone can insert service requests" ON public.service_requests;

-- Recréer la politique avec le bon rôle (anon au lieu de public)
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Vérification : afficher toutes les politiques de la table
-- (pour debug, peut être commenté en production)
-- SELECT * FROM pg_policies WHERE tablename = 'service_requests';
