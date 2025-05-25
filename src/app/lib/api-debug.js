// Utility for debugging API responses

/**
 * Safely parses a response object and logs details for debugging
 * @param {Response} response - Fetch API Response object
 * @returns {Promise<Object>} - Parsed response data
 */
export async function debugResponse(response) {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  let responseText;
  try {
    // Clone the response before reading its body to avoid consuming it
    const clonedResponse = response.clone();
    responseText = await clonedResponse.text();
    console.log('Response text:', responseText);
    
    try {
      // Try to parse as JSON
      const data = JSON.parse(responseText);
      console.log('Parsed JSON data:', data);
      return data;
    } catch (jsonError) {
      console.error('Failed to parse response as JSON:', jsonError);
      return { error: 'Invalid JSON', text: responseText };
    }
  } catch (error) {
    console.error('Error reading response body:', error);
    return { error: 'Failed to read response' };
  }
}

/**
 * Validates an API key by making a simple request
 * @param {string} apiKey - API key to validate
 * @returns {Promise<boolean>} - Whether the key is valid
 */
export async function validateApiKey(apiKey) {
  try {
    const response = await fetch('/api/validate-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });
    
    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

export default {
  debugResponse,
  validateApiKey
};
