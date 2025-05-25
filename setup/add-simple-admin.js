// Simple script to add admin with plain text password
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Prompt for input
function promptQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main function
async function main() {
  try {
    console.log('Add New Admin (Plain Text Password)');
    console.log('==================================');
    
    // Get admin details
    const id = await promptQuestion('Enter admin ID: ');
    const password = await promptQuestion('Enter admin password: ');
    const name = await promptQuestion('Enter admin name (optional): ');
    const email = await promptQuestion('Enter admin email (optional): ');
    
    if (!id || !password) {
      console.error('Error: Admin ID and password are required');
      rl.close();
      return;
    }
    
    // Create the admin with plain text password
    console.log('Creating admin in database...');
    const { data, error } = await supabase
      .from('admins')
      .insert([
        { 
          id: id, 
          password: password, // Plain text password (no hashing)
          name: name || null,
          email: email || null,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error creating admin:', error.message);
    } else {
      console.log('\nAdmin created successfully!');
      console.log(`ID: ${id}`);
      console.log(`Password: ${password} (stored as plain text)`);
      console.log(`Name: ${name || '(not provided)'}`);
      console.log(`Email: ${email || '(not provided)'}`);
      
      console.log('\nYou can now log in with these credentials.');
    }
    
    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Run the main function
main();
