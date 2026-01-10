-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  image_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prayers table
CREATE TABLE IF NOT EXISTS prayers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous BOOLEAN DEFAULT FALSE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;

-- Events policies (public read access)
CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

-- Admins can manage events
CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Prayer policies
-- Users can view all prayers (respecting anonymity)
CREATE POLICY "Anyone can view prayers" ON prayers
  FOR SELECT USING (true);

-- Users can insert their own prayers
CREATE POLICY "Users can insert prayers" ON prayers
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR user_id IS NULL)
  );

-- Users can update their own prayers
CREATE POLICY "Users can update own prayers" ON prayers
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Admins can manage all prayers
CREATE POLICY "Admins can manage prayers" ON prayers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prayers_updated_at
  BEFORE UPDATE ON prayers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample events
INSERT INTO events (title, description, date, time, location, image_url) VALUES
('Culte du Dimanche', 'Service de culte dominical avec prédication et louange', '2024-01-21', '10:00:00', 'Sanctuaire principal', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
('Réunion de Prière', 'Temps de prière communautaire', '2024-01-24', '19:00:00', 'Salle de prière', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'),
('Étude Biblique', 'Étude approfondie de la Parole', '2024-01-26', '18:30:00', 'Salle de conférence', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'),
('Concert de Louange', 'Soirée spéciale de louange et adoration', '2024-01-28', '19:30:00', 'Sanctuaire principal', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400');

-- Insert sample prayers
INSERT INTO prayers (content, user_id, anonymous) VALUES
('Prions pour la paix dans le monde et la guérison de notre communauté.', NULL, true),
('Demandons à Dieu de bénir nos familles et nos proches.', NULL, false),
('Prière pour la sagesse dans les décisions importantes de la vie.', NULL, true);
