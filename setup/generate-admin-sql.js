// Simple script to generate SQL for adding an admin
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    console.log('Generate SQL Command for Adding Admin');
    console.log('====================================');
    
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
    
    console.log('\n--- SQL Command to Add Admin ---');
    console.log(`INSERT INTO public.admins (id, password, name, email, created_at)`);
    console.log(`VALUES (`);
    console.log(`  ${id},`);
    console.log(`  '${password}',`); // Plain text password
    console.log(`  ${name ? `'${name}'` : 'NULL'},`);
    console.log(`  ${email ? `'${email}'` : 'NULL'},`);
    console.log(`  NOW()`);
    console.log(`);`);
    
    console.log('\nRun this SQL command in your Supabase SQL editor to create the admin.');
    
    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Run the main function
main();
