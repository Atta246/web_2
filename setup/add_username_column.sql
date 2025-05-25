-- Add username column to admins table if it doesn't exist

-- Check if the column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'admins'
        AND column_name = 'username'
    ) THEN
        -- Add the username column
        ALTER TABLE public.admins ADD COLUMN username text;
        
        -- Create a unique index on the username column
        CREATE UNIQUE INDEX IF NOT EXISTS admins_username_idx ON public.admins(username);
        
        -- Update existing records to set username equal to id if it's null
        UPDATE public.admins SET username = id::text WHERE username IS NULL;
    END IF;
END $$;
