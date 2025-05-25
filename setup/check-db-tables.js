/**
 * Script to check if all necessary database tables exist and create them if they don't
 * This helps ensure the admin dashboard works properly with the database
 */
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Required tables for the admin dashboard
const requiredTables = [
  {
    name: 'admins',
    schema: `
      CREATE TABLE IF NOT EXISTS public.admins (
        id INT PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  },
  {
    name: 'menu_items',
    schema: `
      CREATE TABLE IF NOT EXISTS public.menu_items (
        item_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        image_url TEXT,
        category_id INT,
        preparation_time INT,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  },
  {
    name: 'reservations',
    schema: `
      CREATE TABLE IF NOT EXISTS public.reservations (
        reservation_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        guests INT NOT NULL,
        table_id INT,
        special_requests TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  },
  {
    name: 'tables',
    schema: `
      CREATE TABLE IF NOT EXISTS public.tables (
        table_id SERIAL PRIMARY KEY,
        table_number INT NOT NULL,
        capacity INT NOT NULL,
        location TEXT,
        is_active BOOLEAN DEFAULT TRUE
      );
    `
  }
];

/**
 * Check if table exists
 * @param {string} tableName - Name of the table to check
 * @returns {Promise<boolean>} - Whether the table exists
 */
async function checkTableExists(tableName) {
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', tableName);
    
  if (error) {
    console.error(`Error checking if ${tableName} exists:`, error);
    return false;
  }
  
  return data && data.length > 0;
}

/**
 * Create a table using raw SQL
 * @param {string} tableName - Name of the table to create
 * @param {string} tableSchema - SQL schema to create the table
 */
async function createTable(tableName, tableSchema) {
  try {
    const { error } = await supabase.rpc('exec', { query: tableSchema });
    
    if (error) {
      console.error(`Error creating ${tableName} table:`, error);
      
      // Try direct query
      console.log(`Trying direct SQL for ${tableName}...`);
      const { error: directError } = await supabase.sql(tableSchema);
      
      if (directError) {
        console.error(`Failed to create ${tableName} using direct SQL:`, directError);
        return false;
      } else {
        console.log(`✅ Created ${tableName} table using direct SQL`);
        return true;
      }
    } else {
      console.log(`✅ Created ${tableName} table`);
      return true;
    }
  } catch (err) {
    console.error(`Unexpected error creating ${tableName}:`, err);
    return false;
  }
}

/**
 * Insert default admin if none exists
 */
async function insertDefaultAdmin() {
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .limit(1);
    
  if (error) {
    console.error('Error checking for existing admins:', error);
    return;
  }
  
  if (data && data.length === 0) {
    console.log('No admins found. Creating default admin...');
    
    const { error: insertError } = await supabase
      .from('admins')
      .insert([
        {
          id: 121401,
          username: 'admin',
          password: 'Atta',
          name: 'System Admin',
          email: 'admin@example.com'
        }
      ]);
      
    if (insertError) {
      console.error('Error creating default admin:', insertError);
    } else {
      console.log('✅ Created default admin (ID: 121401, Password: Atta)');
    }
  } else {
    console.log('✅ Admin account already exists');
  }
}

/**
 * Insert sample tables if none exist
 */
async function insertSampleTables() {
  const { data, error } = await supabase
    .from('tables')
    .select('table_id')
    .limit(1);
    
  if (error) {
    console.error('Error checking for existing tables:', error);
    return;
  }
  
  if (data && data.length === 0) {
    console.log('No tables found. Creating sample tables...');
    
    const sampleTables = [
      { table_number: 1, capacity: 2, location: 'Window' },
      { table_number: 2, capacity: 2, location: 'Window' },
      { table_number: 3, capacity: 4, location: 'Center' },
      { table_number: 4, capacity: 4, location: 'Center' },
      { table_number: 5, capacity: 6, location: 'Back' },
      { table_number: 6, capacity: 8, location: 'Private Room' }
    ];
    
    const { error: insertError } = await supabase
      .from('tables')
      .insert(sampleTables);
      
    if (insertError) {
      console.error('Error creating sample tables:', insertError);
    } else {
      console.log(`✅ Created ${sampleTables.length} sample tables`);
    }
  } else {
    console.log('✅ Tables already exist');
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking and fixing database tables for admin dashboard');
  console.log('=======================================================');
  
  let anyTablesMissing = false;
  
  // Check each required table
  for (const table of requiredTables) {
    process.stdout.write(`Checking for ${table.name} table... `);
    
    const exists = await checkTableExists(table.name);
    
    if (exists) {
      console.log('✅ Found');
    } else {
      console.log('❌ Missing');
      anyTablesMissing = true;
      
      console.log(`Creating ${table.name} table...`);
      await createTable(table.name, table.schema);
    }
  }
  
  // After ensuring tables exist, add sample data if needed
  if (await checkTableExists('admins')) {
    await insertDefaultAdmin();
  }
  
  if (await checkTableExists('tables')) {
    await insertSampleTables();
  }
  
  console.log('\n✨ Database check complete!');
  
  if (anyTablesMissing) {
    console.log('Some tables were missing and have been created. Your admin dashboard should work now.');
  } else {
    console.log('All required tables exist. Your admin dashboard should work correctly.');
  }
}

// Run the script
main()
  .catch(err => console.error('Error in main function:', err))
  .finally(() => process.exit(0));
