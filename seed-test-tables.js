// Script to seed test tables
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client - use the same values as in src/app/lib/supabase.js
const supabaseUrl = 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to seed test tables
async function seedTables() {
  try {
    // Add a large table without removing existing ones
    console.log('Checking for existing large table...');    // Check if we already have a table that can seat more than 10 people
    const { data: existingLargeTables, error: checkError } = await supabase
      .from('tables')
      .select('*')
      .gt('capacity', 10);

    if (checkError) {
      console.error('Error checking for large tables:', checkError);
      return;
    }

    // If we already have large tables, no need to add more
    if (existingLargeTables && existingLargeTables.length > 0) {
      console.log('Large tables already exist:', existingLargeTables);
      return;
    }

    // Add only a large table for 15 people
    const largeTable = {
      table_number: 'T15',
      capacity: 15,
      location: 'Banquet Hall',
      is_active: true
    };

    // Insert large table
    const { data, error } = await supabase.from('tables').insert([largeTable]).select();

    if (error) {
      console.error('Error seeding test tables:', error);
      return;
    }

    console.log('Successfully seeded test tables:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the seeding
seedTables();
