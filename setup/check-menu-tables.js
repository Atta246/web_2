/**
 * Script to check if the menu_items table exists with the correct schema
 * And fix any issues that might be causing errors in the menu management system
 */
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details from the environment or fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Required menu tables for the menu management system
const requiredColumns = [
  { name: 'item_id', type: 'SERIAL PRIMARY KEY' },
  { name: 'name', type: 'TEXT NOT NULL' },
  { name: 'description', type: 'TEXT' },
  { name: 'price', type: 'DECIMAL(10, 2) NOT NULL' },
  { name: 'category', type: 'TEXT' },
  { name: 'category_id', type: 'INTEGER' },
  { name: 'is_available', type: 'BOOLEAN DEFAULT TRUE' },
  { name: 'is_featured', type: 'BOOLEAN DEFAULT FALSE' },
  { name: 'image_url', type: 'TEXT' },
  { name: 'preparation_time', type: 'INTEGER' },
  { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\'::text, now())' },
];

/**
 * Check if menu_items table exists
 * @returns {Promise<boolean>}
 */
async function checkMenuItemsTableExists() {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'menu_items');
      
    if (error) {
      console.error('Error checking if menu_items table exists:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (err) {
    console.error('Unexpected error checking menu_items table:', err);
    return false;
  }
}

/**
 * Check if a column exists in menu_items table
 * @param {string} columnName - Name of the column to check
 * @returns {Promise<boolean>}
 */
async function checkColumnExists(columnName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'menu_items')
      .eq('column_name', columnName);
      
    if (error) {
      console.error(`Error checking if column ${columnName} exists:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (err) {
    console.error(`Unexpected error checking column ${columnName}:`, err);
    return false;
  }
}

/**
 * Add a missing column to the menu_items table
 * @param {string} columnName - Name of the column to add
 * @param {string} columnType - SQL type definition for the column
 */
async function addColumn(columnName, columnType) {
  try {
    const query = `ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS ${columnName} ${columnType};`;
    const { error } = await supabase.rpc('exec', { query });
    
    if (error) {
      console.error(`Error adding column ${columnName}:`, error);
      
      // Try direct SQL
      console.log(`Trying direct SQL for adding column ${columnName}...`);
      const { error: directError } = await supabase.sql(query);
      
      if (directError) {
        console.error(`Failed to add column ${columnName} using direct SQL:`, directError);
        return false;
      } else {
        console.log(`✅ Added column ${columnName} using direct SQL`);
        return true;
      }
    } else {
      console.log(`✅ Added column ${columnName}`);
      return true;
    }
  } catch (err) {
    console.error(`Unexpected error adding column ${columnName}:`, err);
    return false;
  }
}

/**
 * Create the menu_items table
 */
async function createMenuItemsTable() {
  try {
    const tableSchema = `
      CREATE TABLE IF NOT EXISTS public.menu_items (
        item_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category TEXT,
        category_id INTEGER,
        is_available BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        image_url TEXT,
        preparation_time INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `;
    
    const { error } = await supabase.rpc('exec', { query: tableSchema });
    
    if (error) {
      console.error('Error creating menu_items table:', error);
      
      // Try direct SQL
      console.log('Trying direct SQL for creating menu_items table...');
      const { error: directError } = await supabase.sql(tableSchema);
      
      if (directError) {
        console.error('Failed to create menu_items table using direct SQL:', directError);
        return false;
      } else {
        console.log('✅ Created menu_items table using direct SQL');
        return true;
      }
    } else {
      console.log('✅ Created menu_items table');
      return true;
    }
  } catch (err) {
    console.error('Unexpected error creating menu_items table:', err);
    return false;
  }
}

/**
 * Insert sample menu items if none exist
 */
async function insertSampleMenuItems() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('item_id')
      .limit(1);
      
    if (error) {
      console.error('Error checking for existing menu items:', error);
      return;
    }
    
    if (data && data.length === 0) {
      console.log('No menu items found. Creating sample menu items...');
      
      const sampleMenuItems = [
        {
          name: 'Grilled Salmon',
          description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
          price: 24.99,
          category: 'Mains',
          is_available: true,
          is_featured: true,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          preparation_time: 20
        },
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
          price: 18.99,
          category: 'Pizza',
          is_available: true,
          is_featured: false,
          image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
          preparation_time: 15
        },
        {
          name: 'Caesar Salad',
          description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
          price: 12.99,
          category: 'Starters',
          is_available: true,
          is_featured: false,
          image_url: 'https://images.unsplash.com/photo-1551248429-40975aa4de74',
          preparation_time: 10
        }
      ];
      
      const { error: insertError } = await supabase
        .from('menu_items')
        .insert(sampleMenuItems);
        
      if (insertError) {
        console.error('Error creating sample menu items:', insertError);
      } else {
        console.log(`✅ Created ${sampleMenuItems.length} sample menu items`);
      }
    } else {
      console.log('✅ Menu items already exist');
    }
  } catch (err) {
    console.error('Unexpected error creating sample menu items:', err);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking and fixing menu_items table for menu management');
  console.log('=======================================================');
  
  const tableExists = await checkMenuItemsTableExists();
  
  if (tableExists) {
    console.log('✅ menu_items table exists');
    
    // Check each required column and add if missing
    for (const column of requiredColumns) {
      process.stdout.write(`Checking for ${column.name} column... `);
      
      const exists = await checkColumnExists(column.name);
      
      if (exists) {
        console.log('✅ Found');
      } else {
        console.log('❌ Missing');
        console.log(`Adding ${column.name} column...`);
        await addColumn(column.name, column.type);
      }
    }
  } else {
    console.log('❌ menu_items table does not exist');
    console.log('Creating menu_items table...');
    await createMenuItemsTable();
  }
  
  // After ensuring table exists, add sample data if needed
  if (await checkMenuItemsTableExists()) {
    await insertSampleMenuItems();
  }
  
  console.log('\n✨ Menu table check complete!');
}

// Run the script
main()
  .catch(err => console.error('Error in main function:', err))
  .finally(() => process.exit(0));
