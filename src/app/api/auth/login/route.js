// API route for authentication
import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase-server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Validate credentials
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    console.log('Login attempt with:', { username });
    
    // Get all admins (we'll manually find the matching one)
    const { data: allAdmins, error: fetchError } = await supabase
      .from('admins')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching admins:', fetchError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
    
    console.log(`Found ${allAdmins?.length || 0} admins in database`);
    
    // Find the admin that matches either ID or username
    let matchingAdmin = null;
    
    if (allAdmins && allAdmins.length > 0) {
      // First try matching by ID (exact match)
      matchingAdmin = allAdmins.find(admin => 
        String(admin.id) === String(username)
      );
      
      // If not found by ID, try matching by username
      if (!matchingAdmin) {
        matchingAdmin = allAdmins.find(admin => 
          admin.username && String(admin.username).toLowerCase() === String(username).toLowerCase()
        );
      }
    }
    
    if (!matchingAdmin) {
      console.log('No matching admin found for:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    console.log('Found matching admin:', { 
      id: matchingAdmin.id, 
      username: matchingAdmin.username || 'none'
    });    // Direct password comparison without hashing
    // Convert both to strings in case they are stored differently
    const storedPassword = String(matchingAdmin.password).trim();
    const inputPassword = String(password).trim();
    
    console.log('Comparing passwords:', { 
      inputPassword,
      storedPasswordLength: storedPassword.length,
      inputPasswordLength: inputPassword.length,
      storedFirstChar: storedPassword.charAt(0),
      inputFirstChar: inputPassword.charAt(0),
      matches: inputPassword === storedPassword
    });
    
    if (inputPassword !== storedPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
      
    // Generate a simple session token (in a real system, use a JWT library)
    const sessionToken = Buffer.from(`${matchingAdmin.id}-${Date.now()}`).toString('base64');
    
    // Return admin info and token
    return NextResponse.json({
      token: sessionToken,
      user: {
        id: matchingAdmin.id,
        username: matchingAdmin.username || String(matchingAdmin.id),
        name: matchingAdmin.name || 'Admin',
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
