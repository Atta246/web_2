// Simple script to hash a password for admin use

const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Generate password hash
async function generateHash() {
  try {
    rl.question('Enter password to hash: ', async (password) => {
      if (!password) {
        console.error('Password is required');
        rl.close();
        return;
      }

      // Generate hash
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      console.log('\nPassword Hash:');
      console.log(hash);
      
      console.log('\nTo add admin, use this SQL:');
      console.log(`INSERT INTO public.admins (id, password) VALUES (1, '${hash}');`);
      
      rl.close();
    });
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Start the script
generateHash();
