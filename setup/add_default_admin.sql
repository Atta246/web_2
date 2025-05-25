-- Create a default admin account
-- In a real system, you'd use a secure hashing method like bcrypt for the password
INSERT INTO public.admins (id, password)
VALUES (1, 'admin123')
ON CONFLICT (id) DO NOTHING;
