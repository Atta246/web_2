-- Create a stored procedure to add the username column if it doesn't exist

-- Create the function
CREATE OR REPLACE FUNCTION public.add_username_column_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'admins'
        AND column_name = 'username'
    ) THEN
        -- Add the username column
        EXECUTE 'ALTER TABLE public.admins ADD COLUMN username text';
        
        -- Create a unique index on the username column
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS admins_username_idx ON public.admins(username)';
        
        -- Update existing records to set username equal to id if it's null
        EXECUTE 'UPDATE public.admins SET username = id::text WHERE username IS NULL';
    END IF;
END;
$$;
