// Script to verify the API key works with Deepseek
const fetch = require('node-fetch');

const API_KEY = '30e197aa12044759af38f955fe7f8df9';

async function verifyApiKey() {
  try {
    console.log('Verifying API key with Deepseek...');
    
    // Test the models endpoint first
    const modelsResponse = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (modelsResponse.ok) {
      console.log('✅ API key is valid! Models endpoint accessible.');
      const modelsData = await modelsResponse.json();
      console.log('Available models:', modelsData);
      
      // Test a simple chat completion
      console.log('\nTesting a simple chat completion...');
      const chatResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for a restaurant.'
            },
            {
              role: 'user',
              content: 'What are your hours of operation?'
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });
      
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        console.log('✅ Chat completion successful!');
        console.log('AI response:', chatData.choices[0]?.message?.content);
        return true;
      } else {
        const chatError = await chatResponse.text();
        console.error('❌ Chat completion failed:', chatResponse.status, chatError);
        return false;
      }
    } else {
      const error = await modelsResponse.text();
      console.error('❌ API key verification failed:', modelsResponse.status, error);
      return false;
    }
  } catch (err) {
    console.error('❌ Error verifying API key:', err);
    return false;
  }
}

verifyApiKey();
