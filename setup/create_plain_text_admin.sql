-- Create a simple admin account with plain text password
-- Note: This is for development/testing only - not recommended for production

-- If the table doesn't exist yet, create it
CREATE TABLE IF NOT EXISTS public.admins (
  id bigint not null,
  password text not null,
  username text,
  name text,
  email text,
  created_at timestamp with time zone default current_timestamp,
  constraint admins_pkey primary key (id)
);

-- Create a unique index on the username column
CREATE UNIQUE INDEX IF NOT EXISTS admins_username_idx ON public.admins(username);

-- Insert an admin with plain text password
INSERT INTO public.admins (id, username, password, name, email)
VALUES (
  1,                      -- Admin ID (use numeric ID)
  'admin',                -- Username
  'admin123',             -- Plain text password (no hashing)
  'System Admin',         -- Admin name
  'admin@example.com'     -- Admin email
)
ON CONFLICT (id) DO UPDATE
SET 
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- For additional admins, you can add more INSERT statements
-- For example:
-- INSERT INTO public.admins (id, password, name, email)
-- VALUES (2, 'manager123', 'Manager User', 'manager@example.com')
-- ON CONFLICT (id) DO UPDATE
-- SET password = EXCLUDED.password, name = EXCLUDED.name, email = EXCLUDED.email;
