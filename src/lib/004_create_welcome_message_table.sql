-- Create welcome_message table for dynamic welcome content
CREATE TABLE IF NOT EXISTS welcome_message (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    cta_text TEXT DEFAULT 'En savoir plus',
    cta_action TEXT DEFAULT 'about',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE welcome_message ENABLE ROW LEVEL SECURITY;

-- Allow all users to read welcome messages
CREATE POLICY "Allow public read access to welcome messages" ON welcome_message
    FOR SELECT USING (is_active = true);

-- Only authenticated users can insert/update/delete (for admin functionality)
CREATE POLICY "Allow authenticated users to manage welcome messages" ON welcome_message
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_welcome_message_updated_at
    BEFORE UPDATE ON welcome_message
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default welcome message
INSERT INTO welcome_message (title, message, image_url, cta_text, cta_action) VALUES (
    'Bienvenue à l''ADD Poissy ! 🙏',
    'Rejoignez notre communauté de foi et découvrez l''amour de Dieu. "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d''eux." - Matthieu 18:20',
    null,
    'Découvrir notre église',
    'about'
);

-- Create index for performance
CREATE INDEX idx_welcome_message_active_created ON welcome_message (is_active, created_at DESC);
