// Simple script to generate a hashed password and show instructions to add admin

const bcrypt = require('bcryptjs');
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

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Main function
async function main() {
  try {
    console.log('Add New Admin - Password Generator');
    console.log('=================================');
    
    // Get admin details
    const id = await promptQuestion('Enter admin ID: ');
    const password = await promptQuestion('Enter admin password: ');
    const name = await promptQuestion('Enter admin name (optional): ');
    const email = await promptQuestion('Enter admin email (optional): ');
    
    if (!password) {
      console.error('Error: Password is required');
      rl.close();
      return;
    }
    
    // Hash the password
    console.log('\nHashing password...');
    const hashedPassword = await hashPassword(password);
    
    console.log('\nAdmin details generated successfully!');
    console.log('\n--- SQL Command to Add Admin ---');
    console.log(`INSERT INTO public.admins (id, password, name, email, created_at)`);
    console.log(`VALUES (${id}, '${hashedPassword}', ${name ? `'${name}'` : 'NULL'}, ${email ? `'${email}'` : 'NULL'}, NOW());`);
    
    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Run the main function
main();
