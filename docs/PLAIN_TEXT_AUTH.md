# Plain Text Admin Authentication

This document explains how to use the simplified admin authentication system with plain text passwords.

## Database Setup

The system uses the `public.admins` table with the following structure:

```sql
CREATE TABLE public.admins (
  id bigint not null,
  password text not null,
  name text,
  email text,
  created_at timestamp with time zone default current_timestamp,
  constraint admins_pkey primary key (id)
);
```

## Adding an Admin

### Method 1: Using the SQL script

1. Run the provided SQL script in your Supabase SQL editor:
   ```sql
   -- From setup/create_plain_text_admin.sql
   INSERT INTO public.admins (id, password, name, email)
   VALUES (1, 'admin123', 'System Admin', 'admin@example.com');
   ```

### Method 2: Using the script to generate SQL

1. Run the script:
   ```bash
   node setup/generate-admin-sql.js
   ```
2. Follow the prompts to enter admin details.
3. Copy and run the generated SQL in your Supabase SQL editor.

### Method 3: Using the direct admin creation script

1. Run the script:
   ```bash
   node setup/add-simple-admin.js
   ```
2. Follow the prompts to enter admin details.
3. The script will directly add the admin to your database.

## Authentication Flow

1. **Login**: Send a POST request to `/api/auth/login` with:
   ```json
   {
     "username": "admin_id",
     "password": "admin_password"
   }
   ```

2. **Response**: You'll receive a token and user object:
   ```json
   {
     "token": "base64_token_string",
     "user": {
       "id": 1,
       "role": "admin"
     }
   }
   ```

3. **Using the Token**: Include the token in the `Authorization` header for API requests:
   ```
   Authorization: Bearer your_token_here
   ```

## Security Considerations

**IMPORTANT**: This implementation uses plain text passwords, which is NOT secure for production environments. This approach should only be used for:

- Development environments
- Testing purposes
- Simple prototypes

For production use, consider:
1. Implementing proper password hashing (bcrypt, Argon2, etc.)
2. Using OAuth or other secure authentication methods
3. Enabling HTTPS for all API requests
