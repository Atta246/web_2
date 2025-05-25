// Middleware for admin authentication
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '../lib/admin-auth-utils';

/**
 * Admin authentication middleware
 * @param {Request} request - The incoming request
 * @param {Object} context - Route context
 * @returns {Promise<NextResponse>} - Response
 */
export async function adminAuthMiddleware(request, context) {
  // Get the auth header
  const authHeader = request.headers.get('authorization');
  
  // Check if auth header exists and is in correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  // Extract and verify the token
  const token = authHeader.split(' ')[1];
  const admin = await verifyAdminToken(token);
  
  if (!admin) {
    return NextResponse.json(
      { error: 'Invalid or expired authentication token' },
      { status: 401 }
    );
  }
  
  // Add the admin to the request for use in route handlers
  request.admin = admin;
  
  // Continue to the route handler
  return NextResponse.next();
}

/**
 * Function to apply admin auth middleware to specific routes
 * @param {Object} middleware - The middleware function
 * @param {Array} paths - Array of paths to apply middleware to
 * @returns {Function} - Configured middleware
 */
export function withAdminAuth(paths = ['/api/admin']) {
  return async function middleware(request) {
    const { pathname } = new URL(request.url);
    
    // Check if route should be protected
    const shouldProtect = paths.some(path => 
      pathname.startsWith(path)
    );
    
    if (!shouldProtect) {
      return NextResponse.next();
    }
    
    // Apply admin auth middleware
    return await adminAuthMiddleware(request);
  };
}
