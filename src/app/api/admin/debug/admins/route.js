// Debug API endpoint to list admin accounts - DEVELOPMENT ONLY
import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase-server';

export async function GET(request) {
  try {
    // IMPORTANT: This endpoint should be removed or protected in production
    
    // Only allow access in development environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }
    
    // Fetch all admin accounts
    const { data, error } = await supabase
      .from('admins')
      .select('*');
    
    if (error) {
      console.error('Error fetching admin accounts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch admin accounts' },
        { status: 500 }
      );
    }
    
    // Provide info about admin accounts
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      count: data?.length || 0,
      admins: data?.map(admin => ({
        id: admin.id,
        username: admin.username,
        password: admin.password,
        name: admin.name,
        email: admin.email
      })) || []
    });
  } catch (error) {
    console.error('Admin debug endpoint error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
