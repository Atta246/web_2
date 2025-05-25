// API route for admin registration
import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase-server';
import { createAdmin } from '@/app/lib/password-utils';
import { requireRole } from '@/app/lib/auth-utils';

export async function POST(request) {
  try {
    // Only allow existing admin users to create new admins
    const user = await requireRole(request, ['admin']);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    // Extract registration data
    const { id, password, name, email } = await request.json();
    
    // Validate required fields
    if (!id || !password) {
      return NextResponse.json(
        { error: 'Admin ID and password are required' },
        { status: 400 }
      );
    }
    
    // Create the new admin
    const { data, error } = await supabase
      .from('admins')
      .insert([
        { 
          id: id,
          password: password, // This should be hashed in production
          name: name || null,
          email: email || null
        }
      ]);
    
    if (error) {
      console.error('Admin registration error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to register admin' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Admin registered successfully'
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
