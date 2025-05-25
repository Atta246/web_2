const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Main function
async function main() {
  try {
    console.log('Creating demo admin account matching login screen credentials...');
      // Note: Make sure to run the add_username_column.sql or add_username_function.sql
    // script first to ensure the username column exists
    console.log('Note: If this fails, you may need to add the username column to the admins table first');
    
    // Create demo admin with credentials shown on the login screen
    const demoAdmin = {
      id: 121401,
      username: 'admin',
      password: 'admin123',
      name: 'Demo Admin',
      email: 'admin@example.com',
      created_at: new Date().toISOString()
    };
    
    // Insert or update the admin
    const { data, error } = await supabase
      .from('admins')
      .upsert([demoAdmin], { onConflict: 'id' });
    
    if (error) {
      console.error('Error creating demo admin:', error);
      
      // Try alternative approach with different ID if the first one failed
      if (error.code === '23505') { // Unique violation
        console.log('Trying with alternative ID...');
        demoAdmin.id = 999;
        
        const { data: altData, error: altError } = await supabase
          .from('admins')
          .upsert([demoAdmin], { onConflict: 'username' });
          
        if (altError) {
          console.error('Error creating demo admin with alternative ID:', altError);
          process.exit(1);
        }
        
        console.log('Demo admin created successfully with alternative ID!');
      } else {
        process.exit(1);
      }
    } else {
      console.log('Demo admin created successfully!');
    }
    
    console.log('\nLogin credentials:');
    console.log(`Username: ${demoAdmin.username}`);
    console.log(`ID: ${demoAdmin.id}`);
    console.log(`Password: ${demoAdmin.password}`);
    
    console.log('\nYou can now log in with these credentials.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the main function
main();