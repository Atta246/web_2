// A simple script to test the OpenAI API key

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const testOpenAIApiKey = async () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('\x1b[31mError: OPENAI_API_KEY is not set in .env.local\x1b[0m');
    process.exit(1);
  }

  console.log('\x1b[34mTesting OpenAI API key...\x1b[0m');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello!' }
        ],
        max_tokens: 20
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('\x1b[31mAPI Error:', data.error.message, '\x1b[0m');
      process.exit(1);
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('\x1b[32mAPI test successful!\x1b[0m');
      console.log('Response:', data.choices[0].message.content);
    } else {
      console.error('\x1b[31mUnexpected API response format\x1b[0m');
      console.log('Full response:', data);
      process.exit(1);
    }
  } catch (error) {
    console.error('\x1b[31mError connecting to OpenAI API:\x1b[0m', error.message);
    process.exit(1);
  }
};

testOpenAIApiKey();
