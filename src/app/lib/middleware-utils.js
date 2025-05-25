/**
 * Get the authenticated admin from request headers
 * @param {Object} headers - Request headers
 * @returns {Object|null} - Admin object or null
 */
export const getAuthenticatedAdmin = (headers) => {
  const adminId = headers.get('x-admin-id');
  const adminRole = headers.get('x-admin-role');

  if (!adminId || !adminRole) {
    return null;
  }

  return {
    id: adminId,
    role: adminRole
  };
};

/**
 * Check if the request has a valid admin authentication
 * @param {Object} headers - Request headers
 * @returns {boolean} - Whether admin is authenticated
 */
export const isAdminAuthenticated = (headers) => {
  return !!getAuthenticatedAdmin(headers);
};

/**
 * Create an unauthorized response
 * @param {string} message - Error message
 * @returns {Response} - JSON response with error
 */
export const unauthorizedResponse = (message = 'Unauthorized') => {
  return Response.json({ error: message }, { status: 401 });
};

/**
 * Create a forbidden response
 * @param {string} message - Error message
 * @returns {Response} - JSON response with error
 */
export const forbiddenResponse = (message = 'Forbidden') => {
  return Response.json({ error: message }, { status: 403 });
};
