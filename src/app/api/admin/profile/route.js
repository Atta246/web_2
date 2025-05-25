// Protected admin profile API endpoint
import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase-server';
import { getAuthenticatedAdmin, unauthorizedResponse } from '@/app/lib/middleware-utils';

export async function GET(request) {
  try {
    // Get authenticated admin from request headers (set by middleware)
    const admin = getAuthenticatedAdmin(request.headers);
    
    if (!admin) {
      return unauthorizedResponse('Admin authentication required');
    }
    
    // Fetch admin profile from database
    const { data, error } = await supabase
      .from('admins')
      .select('id, name, email, created_at, last_login')
      .eq('id', admin.id)
      .single();
    
    if (error) {
      console.error('Error fetching admin profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch admin profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      admin: {
        ...data,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin profile error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching admin profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Get authenticated admin from request headers
    const admin = getAuthenticatedAdmin(request.headers);
    
    if (!admin) {
      return unauthorizedResponse('Admin authentication required');
    }
    
    // Parse request body
    const updates = await request.json();
    const validFields = ['name', 'email'];
    
    // Filter to only allow specified fields to be updated
    const validUpdates = Object.keys(updates)
      .filter(key => validFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    const { data, error } = await supabase
      .from('admins')
      .update(validUpdates)
      .eq('id', admin.id)
      .select('id, name, email, created_at, last_login')
      .single();
    
    if (error) {
      console.error('Error updating admin profile:', error);
      return NextResponse.json(
        { error: 'Failed to update admin profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      admin: {
        ...data,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating admin profile' },
      { status: 500 }
    );
  }
}
