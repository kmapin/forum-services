/*
  # Création de la table des contacts du Forum des Services

  1. Nouvelle table
    - `service_contacts`
      - `id` (uuid, clé primaire)
      - `first_name` (text, prénom)
      - `last_name` (text, nom)
      - `email` (text, email)
      - `phone` (text, téléphone optionnel)
      - `service_name` (text, nom du service sélectionné)
      - `role` (text, Lead ou Participant)
      - `experience` (text, niveau d'expérience)
      - `message` (text, message optionnel)
      - `created_at` (timestamp, date de création)
      - `updated_at` (timestamp, date de mise à jour)

  2. Sécurité
    - Activer RLS sur la table `service_contacts`
    - Ajouter une politique pour permettre l'insertion publique (pour le formulaire)
    - Ajouter une politique pour permettre la lecture aux utilisateurs authentifiés
*/

CREATE TABLE IF NOT EXISTS service_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  service_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('Lead', 'Participant')),
  experience text DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE service_contacts ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (formulaire de contact)
CREATE POLICY "Permettre insertion publique des contacts"
  ON service_contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour permettre la lecture aux utilisateurs authentifiés
CREATE POLICY "Permettre lecture aux utilisateurs authentifiés"
  ON service_contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_service_contacts_updated_at
  BEFORE UPDATE ON service_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_service_contacts_service_name ON service_contacts(service_name);
CREATE INDEX IF NOT EXISTS idx_service_contacts_created_at ON service_contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_contacts_email ON service_contacts(email);