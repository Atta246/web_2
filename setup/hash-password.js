// Tool to generate a bcrypt hash for a password
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for password
const promptPassword = () => {
  return new Promise((resolve) => {
    rl.question('Enter password to hash: ', (password) => {
      resolve(password);
      rl.close();
    });
  });
};

// Main function
const main = async () => {
  try {
    console.log('Bcrypt Password Hasher');
    console.log('-----------------------');
    
    // Get password
    const password = await promptPassword();
    
    if (!password) {
      console.error('Password is required');
      process.exit(1);
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('\nHashed Password:');
    console.log(hashedPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
main();
