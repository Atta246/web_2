const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
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

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

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
    console.log('Add New Admin to System');
    console.log('======================');
    
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
    
    // Hash the password
    console.log('\nHashing password...');
    const hashedPassword = await hashPassword(password);
    
    // Create the admin
    console.log('Creating admin in database...');
    const { data, error } = await supabase
      .from('admins')
      .insert([
        { 
          id: id, 
          password: hashedPassword,
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
      console.log(`Name: ${name || '(not provided)'}`);
      console.log(`Email: ${email || '(not provided)'}`);
    }
    
    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Run the main function
main();
