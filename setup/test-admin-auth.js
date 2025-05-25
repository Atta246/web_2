// Tool to test admin authentication
const fetch = require('node-fetch');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// API base URL
const API_BASE = 'http://localhost:3000';

// Prompt function
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Login function
async function loginAdmin(username, password) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

// Test authenticated request
async function testAuthenticatedRequest(token) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('API request error:', error);
    return { success: false, error: error.message };
  }
}

// Main function
async function main() {
  try {
    console.log('Admin Authentication Test');
    console.log('-------------------------');
    
    // Get admin credentials
    const username = await prompt('Enter admin ID: ');
    const password = await prompt('Enter password: ');
    
    // Login
    console.log('\nLogging in...');
    const loginResult = await loginAdmin(username, password);
    
    if (!loginResult.success) {
      console.error('Login failed:', loginResult.data.error);
      rl.close();
      return;
    }
    
    console.log('Login successful!');
    console.log('Token:', loginResult.data.token);
    console.log('User:', loginResult.data.user);
    
    // Test authenticated request
    console.log('\nTesting authenticated request...');
    const authResult = await testAuthenticatedRequest(loginResult.data.token);
    
    if (!authResult.success) {
      console.error('Authentication test failed:', authResult.data.error);
      rl.close();
      return;
    }
    
    console.log('Authentication test succeeded!');
    console.log('Admin profile:', authResult.data.admin);
    
    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Run the script
main();
