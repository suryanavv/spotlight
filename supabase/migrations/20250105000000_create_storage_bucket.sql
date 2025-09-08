-- Create the portfolio storage bucket for avatars and project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update their files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to view files (needed for displaying images)
CREATE POLICY "Allow public access to view files" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio');
