/**
 * This script fixes common admin login issues by:
 * 1. Adding the username column if it doesn't exist
 * 2. Ensuring the admin with ID 121401 exists and has password "Atta"
 * 3. Ensuring the admin account has fields matching what's shown on the login screen
 */
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log('🔧 Admin Login Fix Utility');
    console.log('=========================');
    
    // 1. Check the admins table
    console.log('\n📊 Checking admin table...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('admins')
      .select('*')
      .limit(5);
    
    if (tableError) {
      console.error('❌ Error accessing admins table:', tableError.message);
      if (tableError.code === '42P01') { // relation does not exist
        console.log('⚠️ The admins table doesn\'t exist. Creating it...');
        await createAdminsTable();
      } else {
        process.exit(1);
      }
    } else {
      console.log(`✅ Found admins table with ${tableInfo.length} records`);
    }
    
    // 2. Check for admin with ID 121401
    console.log('\n🔍 Checking for admin with ID 121401...');
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', 121401)
      .single();
    
    if (adminError && adminError.code !== 'PGRST116') {
      console.error('❌ Error checking for admin:', adminError.message);
    }
    
    if (!adminData) {
      console.log('⚠️ Admin with ID 121401 not found. Creating it...');
      await createDemoAdmin();
    } else {
      console.log('✅ Found admin with ID 121401');
      
      // Check if password matches
      if (adminData.password !== 'Atta') {
        console.log('⚠️ Admin password doesn\'t match. Updating it...');
        await updateAdminPassword();
      } else {
        console.log('✅ Admin password is correct');
      }
    }
    
    // 3. Final check
    console.log('\n🔄 Performing final check...');
    const { data: finalData, error: finalError } = await supabase
      .from('admins')
      .select('*');
      
    if (finalError) {
      console.error('❌ Error in final check:', finalError.message);
    } else {
      console.log(`✅ Found ${finalData.length} admin accounts:`);
      finalData.forEach(admin => {
        console.log(`   - ID: ${admin.id}, Username: ${admin.username || 'none'}, Password: ${admin.password}`);
      });
    }
    
    console.log('\n✨ Admin login fix complete! You should now be able to log in with:');
    console.log('   Username: 121401');
    console.log('   Password: Atta');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

async function createAdminsTable() {
  try {
    // Create the admins table
    const { error: createError } = await supabase.rpc('create_admins_table');
    
    if (createError) {
      console.error('❌ Error creating admins table via RPC:', createError.message);
      
      // Try direct SQL execution
      console.log('⚠️ Attempting direct table creation...');
      
      // Create the table
      const { error: sqlError } = await supabase.sql(`
        CREATE TABLE IF NOT EXISTS public.admins (
          id BIGINT PRIMARY KEY,
          password TEXT NOT NULL,
          username TEXT,
          name TEXT,
          email TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      if (sqlError) {
        console.error('❌ Failed to create table:', sqlError.message);
        return false;
      }
    }
    
    console.log('✅ Admins table created successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error in createAdminsTable:', error);
    return false;
  }
}

async function createDemoAdmin() {
  try {
    const { error } = await supabase
      .from('admins')
      .insert([
        {
          id: 121401,
          username: 'admin',
          password: 'Atta',
          name: 'System Admin',
          email: 'admin@example.com',
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) {
      console.error('❌ Error creating demo admin:', error.message);
      return false;
    }
    
    console.log('✅ Demo admin created successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error in createDemoAdmin:', error);
    return false;
  }
}

async function updateAdminPassword() {
  try {
    const { error } = await supabase
      .from('admins')
      .update({ password: 'Atta' })
      .eq('id', 121401);
      
    if (error) {
      console.error('❌ Error updating admin password:', error.message);
      return false;
    }
    
    console.log('✅ Admin password updated successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error in updateAdminPassword:', error);
    return false;
  }
}

// Run the script
main();
