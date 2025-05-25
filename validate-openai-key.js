// This script validates the OpenAI API key at startup

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

require('dotenv').config({ path: '.env.local' });

const validateOpenAIApiKey = async () => {
  try {
    // Check if we have an API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {      console.log('\x1b[33m%s\x1b[0m', 'Deepseek API key not found. Chatbot will use fallback responses.');
      return false;
    }

    console.log('\x1b[34m%s\x1b[0m', 'Validating Deepseek API key...');
      // Test the API key with a minimal API call
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));      console.error('\x1b[31m%s\x1b[0m', 'Deepseek API key validation failed:', 
                    errorData.error?.message || `Status code: ${response.status}`);
      console.log('\x1b[33m%s\x1b[0m', 'Chatbot will use fallback responses.');
      return false;
    }

    console.log('\x1b[32m%s\x1b[0m', 'Deepseek API key is valid!');
    console.log('\x1b[32m%s\x1b[0m', 'Chatbot is ready to use AI-powered responses.');
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error validating OpenAI API key:', error.message);
    console.log('\x1b[33m%s\x1b[0m', 'Chatbot will use fallback responses.');
    return false;
  }
};

// Export for use in server.js
module.exports = validateOpenAIApiKey;

// If this script is run directly, validate the key
if (require.main === module) {
  validateOpenAIApiKey().then(isValid => {
    if (!isValid) {
      console.log('\x1b[36m%s\x1b[0m', 
        'To use AI-powered responses, please add a valid OpenAI API key to your .env.local file:');
      console.log('OPENAI_API_KEY=your_api_key_here');
    }
  }).catch(error => {
    console.error('Unexpected error:', error);
  });
}
