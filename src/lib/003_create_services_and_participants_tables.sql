-- Create services table (restructured)
-- Services représentent les différents départements/ministères de l'église
-- Ex: Jeunesse, Enfants, Louange, Prière, etc.
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- Ex: 'youth', 'children', 'worship'
  display_name TEXT NOT NULL, -- Ex: 'Jeunesse', 'Enfants', 'Louange'
  description TEXT,
  emoji TEXT, -- Ex: '🧑‍🤝‍🧑', '👶', '🎵'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_leaders table (junction table for many-to-many relationship)
-- Permet d'avoir jusqu'à 3 leaders par service
CREATE TABLE IF NOT EXISTS service_leaders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  position INTEGER CHECK (position >= 1 AND position <= 3), -- 1 = Leader principal, 2 = Co-leader, 3 = Assistant
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  assigned_by UUID REFERENCES auth.users(id), -- Qui a assigné ce leader
  UNIQUE(service_id, user_id), -- Un utilisateur ne peut être leader qu'une fois par service
  UNIQUE(service_id, position) -- Une position ne peut être occupée qu'une fois par service
);

-- Create service_members table (membres de chaque service)
-- Permet aux leaders de gérer les membres de leur service
CREATE TABLE IF NOT EXISTS service_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  added_by UUID REFERENCES auth.users(id), -- Qui a ajouté ce membre
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT, -- Notes du leader sur ce membre
  UNIQUE(service_id, user_id) -- Un utilisateur ne peut être membre qu'une fois par service
);

-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Services policies (public read access)
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (true);

-- Pastors and admins can manage services
CREATE POLICY "Pastors can manage services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Service Leaders policies
-- Anyone can view service leaders
CREATE POLICY "Anyone can view service leaders" ON service_leaders
  FOR SELECT USING (true);

-- Pastors and admins can manage service leaders
CREATE POLICY "Pastors can manage service leaders" ON service_leaders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Service Members policies
-- Anyone can view service members
CREATE POLICY "Anyone can view service members" ON service_members
  FOR SELECT USING (true);

-- Leaders can manage members of their service
CREATE POLICY "Leaders can manage their service members" ON service_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM service_leaders sl
      WHERE sl.service_id = service_members.service_id
      AND sl.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'pastor')
    )
  );

-- Users can see which services they are members of
CREATE POLICY "Users can view their own memberships" ON service_members
  FOR SELECT USING (user_id = auth.uid());

-- Event participants policies
-- Users can view all participants
CREATE POLICY "Anyone can view event participants" ON event_participants
  FOR SELECT USING (true);

-- Users can manage their own participation
CREATE POLICY "Users can manage own participation" ON event_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own participation" ON event_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all participations
CREATE POLICY "Admins can manage all participations" ON event_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services (départements/ministères)
INSERT INTO services (name, display_name, description, emoji, is_active) VALUES
('youth', 'Jeunesse', 'Ministère des jeunes (13-25 ans)', '🧑‍🤝‍🧑', true),
('children', 'Enfants', 'Ministère des enfants (0-12 ans)', '👶', true),
('worship', 'Louange', 'Équipe de louange et adoration', '🎵', true),
('prayer', 'Prière', 'Groupe d''intercession et prière', '🙏', true),
('outreach', 'Évangélisation', 'Ministère d''évangélisation et missions', '🤝', true),
('media', 'Média', 'Équipe technique et multimédia', '📺', true),
('hospitality', 'Accueil', 'Équipe d''accueil et hospitalité', '☕', true),
('security', 'Sécurité', 'Équipe de sécurité et ordre', '🛡️', true),
('finance', 'Finance', 'Gestion financière et comptabilité', '💰', true),
('education', 'Éducation', 'École du dimanche et formation', '📚', true)
ON CONFLICT (name) DO NOTHING;
