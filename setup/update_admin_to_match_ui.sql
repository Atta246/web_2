-- Update admin credentials to match what's shown on the login screen

-- First, check if the admin with ID 121401 exists
DO $$
DECLARE
    admin_exists INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_exists FROM public.admins WHERE id = 121401;
    
    -- Update the admin password to match the one shown in the login screen
    IF admin_exists > 0 THEN
        UPDATE public.admins
        SET password = 'Atta'
        WHERE id = 121401;
        
        RAISE NOTICE 'Updated admin with ID 121401 to have password "Atta"';
    ELSE
        -- Create the admin if it doesn't exist
        INSERT INTO public.admins (id, username, password, name, email)
        VALUES (
            121401,
            'admin',
            'Atta',
            'System Admin',
            'admin@example.com'
        );
        
        RAISE NOTICE 'Created admin with ID 121401 and password "Atta"';
    END IF;
END $$;
