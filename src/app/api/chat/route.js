import { NextResponse } from 'next/server';
import { getFallbackResponse } from '../../lib/fallback-responses';
import config from '../../lib/openai-config';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    // Get the latest user message
    const latestUserMessage = messages
      .filter(message => message.role === 'user')
      .pop()?.content;
    
    if (!latestUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }    // Using config.apiKey which has been updated with the direct API key
    if (!config.apiKey) {
      console.log('No Deepseek API key found, using fallback response');
      const fallbackResponse = getFallbackResponse(latestUserMessage);
      return NextResponse.json({ message: fallbackResponse });
    }

    // Format messages for the OpenAI API
    const formattedMessages = messages.map(message => ({
      role: message.role === 'system' ? 'assistant' : message.role,
      content: message.content,
    }));

    // Call Deepseek API
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: config.systemPrompt
            },
            ...formattedMessages
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        })
      });

      // Simpler approach to handle response
      let data;
      
      try {
        // Get response as text first to safely handle JSON parsing
        const responseText = await response.text();
        
        try {
          // Try to parse as JSON
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Invalid JSON in Deepseek response');
          throw new Error('The API returned an invalid response format');
        }
            // Check if the response indicates an error
        if (!response.ok) {
          const errorMessage = data.error?.message || `Deepseek API error: ${response.status}`;
          console.error('Deepseek API error:', data);
          throw new Error(errorMessage);
        }
        
        // Log successful response for debugging
        console.log('Deepseek API successful response', data);
      } catch (responseError) {
        console.error('Error processing OpenAI response:', responseError);
        throw responseError;
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected Deepseek API response format:', data);
        throw new Error('Unexpected API response format');
      }

      const aiMessage = data.choices[0].message.content;

      return NextResponse.json({ message: aiMessage });
    } catch (openaiError) {
      console.error('Deepseek API error:', openaiError);
      throw openaiError; // Rethrow to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Use fallback response when API fails
    try {
      // Extract the user message safely
      let latestUserMessage = '';
      if (messages && Array.isArray(messages)) {
        const userMessages = messages.filter(message => message.role === 'user');
        if (userMessages.length > 0) {
          latestUserMessage = userMessages[userMessages.length - 1].content || '';
        }
      }
      
      if (latestUserMessage) {
        const fallbackResponse = getFallbackResponse(latestUserMessage);
        return NextResponse.json({ message: fallbackResponse });
      }
    } catch (fallbackError) {
      console.error('Error generating fallback response:', fallbackError);
    }
    
    return NextResponse.json(
      { message: 'I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try again later or contact the restaurant directly for assistance.' },
      { status: 200 } // Return 200 with a friendly message instead of an error
    );
  }
}
