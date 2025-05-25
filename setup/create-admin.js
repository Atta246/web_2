// Script to create a new admin user
import supabase from '../src/app/lib/supabase';
import { createAdmin } from '../src/app/lib/password-utils';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for admin details
const promptAdminDetails = () => {
  return new Promise((resolve) => {
    rl.question('Enter admin ID: ', (id) => {
      rl.question('Enter admin password: ', (password) => {
        resolve({ id, password });
        rl.close();
      });
    });
  });
};

// Main function
const main = async () => {
  try {
    console.log('Creating a new admin user...');
    
    // Get admin details
    const { id, password } = await promptAdminDetails();
    
    if (!id || !password) {
      console.error('Admin ID and password are required');
      process.exit(1);
    }
    
    // Create the admin in the database
    const { data, error } = await createAdmin(supabase, id, password);
    
    if (error) {
      console.error('Error creating admin:', error.message);
      process.exit(1);
    }
    
    console.log('Admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
};

// Run the script
main();
