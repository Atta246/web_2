// Authentication utility functions
import supabase from './supabase-server';

/**
 * Verify a JWT token from Supabase Auth
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Object|null>} - The user data or null if invalid
 */
export const verifyToken = async (token) => {
  if (!token) return null;
  
  try {
    // Set the auth token in the Supabase client
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Token verification error:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Token verification exception:', error);
    return null;
  }
};

/**
 * Middleware function to check if a user is authenticated
 * @param {Request} request - The HTTP request
 * @returns {Promise<Object|null>} - The user data or null if not authenticated
 */
export const requireAuth = async (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  return await verifyToken(token);
};

/**
 * Check if a user has a specific role
 * @param {Object} user - The user object from Supabase Auth
 * @param {string|string[]} roles - Required role(s)
 * @returns {boolean} - Whether the user has the required role
 */
export const hasRole = (user, roles) => {
  if (!user || !user.user_metadata) return false;
  
  const userRole = user.user_metadata.role;
  
  if (Array.isArray(roles)) {
    return roles.includes(userRole);
  }
  
  return userRole === roles;
};

/**
 * Middleware to require specific role(s)
 * @param {Request} request - The HTTP request
 * @param {string|string[]} roles - Required role(s)
 * @returns {Promise<Object|null>} - The user data or null if not authorized
 */
export const requireRole = async (request, roles) => {
  const user = await requireAuth(request);
  if (!user) return null;
  
  if (!hasRole(user, roles)) return null;
  
  return user;
};
