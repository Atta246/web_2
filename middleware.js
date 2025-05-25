// middleware.js - Admin authentication middleware
import { NextResponse } from 'next/server';
import { verifyAdminToken } from './src/app/lib/admin-auth-utils';

export default async function middleware(request) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Only apply to protected API routes
  if (path.startsWith('/api/admin') || 
      path.includes('/api/menu') && !request.method === 'GET' || 
      path.includes('/api/reservation') && !request.method === 'POST') {
    
    // Get the authentication token from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the admin token
      const admin = await verifyAdminToken(token);
      
      // Check if admin token is valid
      if (!admin) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        );
      }
      
      // Check if user has admin role
      if (admin.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        );
      }
        // Add the admin to the request context
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-id', admin.id);
      requestHeaders.set('x-admin-role', admin.role);
      
      // Create a new request with modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      });
    } catch (error) {
      console.error('Admin authentication error:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Authentication failed' },
        { status: 401 }
      );
    }
  }

  // Not a protected route, proceed
  return NextResponse.next();
}
