# Admin Authentication System Setup Commands

# Install required packages
npm install bcryptjs jsonwebtoken

# Create database tables
# (Run this in your database)
psql -U postgres -d your_database_name -f setup/setup_admins_table.sql

# Create a hashed password for an admin
node setup/hash-password.js

# Insert an admin with the hashed password
# (Update with your generated hash)
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

async function createAdmin() {
  const { data, error } = await supabase
    .from('admins')
    .insert([
      { 
        id: 1, 
        password: 'YOUR_HASHED_PASSWORD',
        name: 'Admin User',
        email: 'admin@example.com'
      }
    ]);
  
  if (error) {
    console.error('Error creating admin:', error);
  } else {
    console.log('Admin created successfully!');
  }
}

createAdmin();
"

# Test admin authentication
node setup/test-admin-auth.js
