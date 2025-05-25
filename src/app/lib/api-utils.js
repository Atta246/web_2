// Utility functions for API responses and error handling

/**
 * Create a success response
 * @param {any} data - Data to return in the response
 * @param {number} status - HTTP status code (default: 200)
 * @returns {Response} - JSON response
 */
export function successResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default: 500)
 * @returns {Response} - JSON response with error
 */
export function errorResponse(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Validate request body against required fields
 * @param {Object} body - Request body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} - Validation result { valid: boolean, error: string }
 */
export function validateRequest(body, requiredFields) {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  return { valid: true };
}

/**
 * Try to parse JSON from request
 * @param {Request} request - The HTTP request
 * @returns {Promise<Object>} - Parsed JSON body or error
 */
export async function parseRequestBody(request) {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Wrapper function to handle API route with error handling
 * @param {Function} handler - API route handler function
 * @returns {Function} - Wrapped handler with error handling
 */
export function withErrorHandling(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API error:', error);
      return errorResponse(error.message);
    }
  };
}
