-- Create storage bucket for learning content
INSERT INTO storage.buckets (id, name, public)
VALUES ('learning-content', 'learning-content', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for learning content
CREATE POLICY "Allow authenticated users to upload learning content"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'learning-content');

CREATE POLICY "Allow public read access to learning content"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'learning-content');

CREATE POLICY "Allow authenticated users to update their learning content"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'learning-content');

CREATE POLICY "Allow authenticated users to delete their learning content"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'learning-content');
