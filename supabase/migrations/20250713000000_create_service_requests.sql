-- Migration pour créer la table des demandes de service de conciergerie
-- Date: 2025-07-13

-- Créer la table service_requests
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_slug TEXT NOT NULL,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Créer un index sur le statut pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);

-- Créer un index sur la date de création
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON public.service_requests(created_at DESC);

-- Créer un index sur le service_slug
CREATE INDEX IF NOT EXISTS idx_service_requests_service_slug ON public.service_requests(service_slug);

-- Créer un index sur l'email pour recherche
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON public.service_requests(email);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_service_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS trigger_update_service_requests_updated_at ON public.service_requests;
CREATE TRIGGER trigger_update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_service_requests_updated_at();

-- Activer Row Level Security (RLS)
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut insérer (pour les formulaires publics)
CREATE POLICY "Anyone can insert service requests"
    ON public.service_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Politique : Seuls les administrateurs authentifiés peuvent lire
CREATE POLICY "Authenticated users can read service requests"
    ON public.service_requests
    FOR SELECT
    TO authenticated
    USING (true);

-- Politique : Seuls les administrateurs authentifiés peuvent mettre à jour
CREATE POLICY "Authenticated users can update service requests"
    ON public.service_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politique : Seuls les administrateurs authentifiés peuvent supprimer
CREATE POLICY "Authenticated users can delete service requests"
    ON public.service_requests
    FOR DELETE
    TO authenticated
    USING (true);

-- Commentaires pour la documentation
COMMENT ON TABLE public.service_requests IS 'Table pour stocker les demandes de service de conciergerie';
COMMENT ON COLUMN public.service_requests.id IS 'Identifiant unique de la demande';
COMMENT ON COLUMN public.service_requests.service_id IS 'Identifiant du service demandé';
COMMENT ON COLUMN public.service_requests.service_name IS 'Nom du service demandé';
COMMENT ON COLUMN public.service_requests.service_slug IS 'Slug du service pour les URLs';
COMMENT ON COLUMN public.service_requests.last_name IS 'Nom de famille du demandeur';
COMMENT ON COLUMN public.service_requests.first_name IS 'Prénom du demandeur';
COMMENT ON COLUMN public.service_requests.email IS 'Email du demandeur';
COMMENT ON COLUMN public.service_requests.phone IS 'Téléphone du demandeur';
COMMENT ON COLUMN public.service_requests.address IS 'Adresse du demandeur (optionnel)';
COMMENT ON COLUMN public.service_requests.message IS 'Message ou détails supplémentaires (optionnel)';
COMMENT ON COLUMN public.service_requests.status IS 'Statut de la demande: pending, contacted, completed, cancelled';
COMMENT ON COLUMN public.service_requests.created_at IS 'Date de création de la demande';
COMMENT ON COLUMN public.service_requests.updated_at IS 'Date de dernière mise à jour';
