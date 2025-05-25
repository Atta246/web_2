# Restaurant Support Chatbot Setup

This document provides instructions for setting up and configuring the restaurant support chatbot powered by OpenAI.

## Chatbot Implementation

Our restaurant chatbot uses OpenAI's powerful language models to provide intelligent responses to customer inquiries. If the OpenAI API is unavailable, it falls back to a smart local response system. The chatbot can respond to common restaurant-related queries about:

- Opening hours
- Reservations
- Menu and food options
- Location and directions
- Pricing
- Dietary restrictions
- And more!

## Setting Up the Chatbot

### OpenAI API Key Configuration

1. Get an API key from OpenAI by signing up at [platform.openai.com](https://platform.openai.com/)
2. Add your API key to the `.env.local` file in the project root:

```
OPENAI_API_KEY=your_api_key_here
```

3. Run the verification script to check if your setup is working:

```powershell
.\verify-chatbot-setup.ps1
```

### Fallback System

The chatbot has a built-in fallback system that provides responses even when the OpenAI API is unavailable:

1. If the API key is missing or invalid
2. If there are connectivity issues
3. If there's a problem parsing the response

This ensures your customers always get helpful information.

## Testing the Chatbot

1. You can run a quick test of the OpenAI API key using:
   ```powershell
   node test-openai-api-key.js
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. Open your browser and navigate to `/support` page
4. Try sending various questions to the chatbot to verify it's working

## Customizing the Chatbot

### OpenAI Configuration

To customize the OpenAI API behavior:

1. Open `src/app/lib/openai-config.js`
2. Modify the configuration options:
   - `model`: Change the OpenAI model (e.g., 'gpt-4')
   - `temperature`: Adjust creativity (0.0 - 1.0)
   - `maxTokens`: Set maximum response length
   - `systemPrompt`: Modify the instructions for the AI

### Fallback Responses

To customize the local fallback responses:

1. Open `src/app/lib/fallback-responses.js`
2. Update the restaurant information and responses
3. Add new keyword-response pairs for different customer inquiries

## Example Questions to Try

- "What are your opening hours?"
- "Can I make a reservation for a party of 10?"
- "Do you have vegetarian options?"
- "Where are you located?"
- "Is there parking available?"
- "Do you offer takeout or delivery?"
- "What's your most popular dish?"
- "Do you accommodate food allergies?"

## Troubleshooting

### OpenAI API Issues

If you're experiencing issues with the OpenAI API:

1. Verify your API key is correctly set in `.env.local`
2. Check that the API key has not expired or reached its usage limit
3. Inspect the browser console for detailed error messages
4. Run `node test-openai-api-key.js` to test connectivity

### UI Issues

If the chat interface is not working correctly:

1. Make sure all required JavaScript files are being loaded
2. Check for any errors in the browser console
3. Try clearing your browser cache and reloading
4. Verify that API requests are being made correctly (check Network tab)

## API Usage Costs

Note that using the OpenAI API incurs costs based on usage:

1. Monitor your usage on the [OpenAI Dashboard](https://platform.openai.com/usage)
2. Set usage limits to prevent unexpected charges 
3. Consider implementing rate limiting if needed

## Need More Help?

If you want to enhance the chatbot with additional functionality or have any questions, please contact the development team for assistance.
