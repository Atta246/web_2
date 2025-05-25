-- Add a demo admin with credentials shown on the login screen

-- Run the schema update first to ensure the username column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'admins'
        AND column_name = 'username'
    ) THEN
        ALTER TABLE public.admins ADD COLUMN username text;
        CREATE UNIQUE INDEX IF NOT EXISTS admins_username_idx ON public.admins(username);
    END IF;
END $$;

-- Insert or update demo admin with the exact credentials shown on the login page
INSERT INTO public.admins (id, username, password, name, email, created_at)
VALUES (
    121401,             -- ID matching the one in the form 
    'admin',            -- Username shown in demo credentials
    'admin123',         -- Password shown in demo credentials
    'Demo Admin',       -- Name
    'admin@example.com', -- Email
    NOW()               -- Current timestamp
)
ON CONFLICT (id) DO UPDATE
SET 
    username = EXCLUDED.username,
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    email = EXCLUDED.email;

-- Also insert using username as key in case ID already exists but with different value
INSERT INTO public.admins (id, username, password, name, email, created_at)
VALUES (
    999,                -- Alternative ID if 121401 is taken
    'admin',            -- Username shown in demo credentials
    'admin123',         -- Password shown in demo credentials
    'Demo Admin',       -- Name
    'admin@example.com', -- Email
    NOW()               -- Current timestamp
)
ON CONFLICT (username) DO UPDATE
SET 
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    email = EXCLUDED.email;