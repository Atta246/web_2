import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'No API key provided' });
    }
      // Make a minimal request to Deepseek API to validate the key
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.ok) {
      return NextResponse.json({ valid: true });
    } else {
      // If we got a specific error, include it in the response
      try {
        const errorData = await response.json();
        return NextResponse.json({ 
          valid: false, 
          error: errorData.error?.message || `API error: ${response.status}`
        });
      } catch (e) {
        return NextResponse.json({ 
          valid: false, 
          error: `Invalid API key or API error (${response.status})`
        });
      }
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json({ 
      valid: false, 
      error: error.message || 'Unknown error validating API key'
    });
  }
}
