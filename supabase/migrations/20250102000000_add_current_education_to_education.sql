-- Add current_education column to education table
ALTER TABLE public.education
ADD COLUMN current_education BOOLEAN DEFAULT false;

-- Add comment to document the column
COMMENT ON COLUMN public.education.current_education IS 'Indicates if this is the user''s current education/ongoing study';
