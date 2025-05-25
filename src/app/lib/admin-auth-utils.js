// Admin authentication utility functions
import supabaseServer from './supabase-server';

/**
 * Verify an admin token
 * @param {string} token - The admin token to verify
 * @returns {Promise<Object|null>} - The admin data or null if invalid
 */
export const verifyAdminToken = async (token) => {
  if (!token) return null;
  
  try {
    // Decode the token to get admin ID
    // This is a simple implementation. In production, use JWT or a secure token system
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const adminId = decoded.split('-')[0];
    
    if (!adminId) return null;
      // Check if admin exists
    const { data, error } = await supabaseServer
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();
    
    if (error || !data) {
      console.error('Admin verification error:', error);
      return null;
    }
    
    return {
      id: data.id,
      role: 'admin'
    };
  } catch (error) {
    console.error('Token verification exception:', error);
    return null;
  }
};

/**
 * Middleware function to check if an admin is authenticated
 * @param {Request} request - The HTTP request
 * @returns {Promise<Object|null>} - The admin data or null if not authenticated
 */
export const requireAdminAuth = async (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  return await verifyAdminToken(token);
};
