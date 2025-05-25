/**
 * Test script to verify the admin login is working properly
 */
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminLogin() {
  try {
    console.log('🔍 Testing Admin Login Fix');
    console.log('========================');
    
    // Check for admin with ID 121401
    console.log('Looking for admin with ID 121401...');
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', 121401)
      .single();
    
    if (adminError) {
      console.error('❌ Error checking for admin:', adminError.message);
      if (adminError.code === 'PGRST116') {
        console.log('⚠️ Admin with ID 121401 not found in database!');
        return;
      }
      return;
    }
    
    console.log('✅ Found admin record:', {
      id: adminData.id,
      username: adminData.username || 'none',
      password: adminData.password
    });
    
    // Test the login API
    console.log('\n🔐 Testing login API with credentials...');
    
    try {
      // Simulate the API call but with direct database comparison
      // This is to isolate potential issues
      const storedPassword = String(adminData.password).trim();
      const inputPassword = 'Atta';
      
      console.log('Comparing passwords:');
      console.log('- Stored password:', storedPassword);
      console.log('- Input password:', inputPassword);
      console.log('- Exactly equal:', storedPassword === inputPassword);
      console.log('- Character comparison:');
      
      // Compare each character for debugging
      for (let i = 0; i < Math.max(storedPassword.length, inputPassword.length); i++) {
        const storedChar = storedPassword[i] || '[end]';
        const inputChar = inputPassword[i] || '[end]';
        const charEqual = storedChar === inputChar;
        console.log(`  Pos ${i}: '${storedChar}' vs '${inputChar}' - ${charEqual ? '✓' : '✗'}`);
      }
      
      if (storedPassword === inputPassword) {
        console.log('✅ Password comparison succeeded!');
      } else {
        console.log('❌ Password comparison failed!');
      }
    } catch (error) {
      console.error('❌ Login simulation error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAdminLogin();
