// JavaScript utility for initializing and seeding restaurant tables in Supabase
// Use this script to create and populate tables for the reservation system

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project details
// Replace these values with your actual Supabase URL and anon key
const supabaseUrl = 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to initialize and seed the database
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // 1. Create tables table (if not exists)
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS tables (
            table_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            table_number VARCHAR(10) NOT NULL,
            capacity INT NOT NULL,
            location VARCHAR(50),
            is_active BOOLEAN DEFAULT TRUE
        );
      `
    });
    
    // 2. Create customer_profiles table (if not exists)
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS customer_profiles (
            profile_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id UUID,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(100),
            preferences TEXT,
            loyalty_points INT DEFAULT 0,
            is_guest BOOLEAN DEFAULT TRUE
        );
      `
    });
    
    // 3. Create reservations table (if not exists)
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS reservations (
            reservation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            customer_id BIGINT REFERENCES customer_profiles(profile_id) ON DELETE SET NULL,
            table_id BIGINT NOT NULL REFERENCES tables(table_id) ON DELETE CASCADE,
            reservation_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            party_size INT NOT NULL,
            special_requests TEXT,
            status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    });

    console.log('Tables created successfully');

    // 4. Check for existing tables
    const { data: existingTables, error: tablesError } = await supabase
      .from('tables')
      .select('*');
    
    if (tablesError) {
      console.error('Error checking existing tables:', tablesError);
      return;
    }
    
    // 5. If no tables exist, seed initial table data
    if (!existingTables || existingTables.length === 0) {
      const tablesToInsert = [
        { table_number: 'T1', capacity: 2, location: 'Window', is_active: true },
        { table_number: 'T2', capacity: 2, location: 'Window', is_active: true },
        { table_number: 'T3', capacity: 4, location: 'Center', is_active: true },
        { table_number: 'T4', capacity: 4, location: 'Center', is_active: true },
        { table_number: 'T5', capacity: 6, location: 'Corner', is_active: true },
        { table_number: 'T6', capacity: 6, location: 'Patio', is_active: true },
        { table_number: 'T7', capacity: 8, location: 'Private Room', is_active: true },
        { table_number: 'T8', capacity: 10, location: 'Private Room', is_active: true },
        { table_number: 'T15', capacity: 15, location: 'Banquet Hall', is_active: true } // Large table for groups over 10
      ];
      
      const { data: insertedTables, error: insertError } = await supabase
        .from('tables')
        .insert(tablesToInsert)
        .select();
      
      if (insertError) {
        console.error('Error inserting tables:', insertError);
      } else {
        console.log(`Successfully inserted ${insertedTables.length} tables`);
      }
    } else {
      console.log(`${existingTables.length} tables already exist. Checking for large table...`);
      
      // Check if we have a table that can seat more than 10 people
      const { data: largeTables, error: largeTableError } = await supabase
        .from('tables')
        .select('*')
        .gt('capacity', 10);
      
      if (largeTableError) {
        console.error('Error checking for large tables:', largeTableError);
      } else if (!largeTables || largeTables.length === 0) {
        // Add a large table if none exists
        const { data: largeTableInsert, error: largeInsertError } = await supabase
          .from('tables')
          .insert([{ table_number: 'T15', capacity: 15, location: 'Banquet Hall', is_active: true }])
          .select();
        
        if (largeInsertError) {
          console.error('Error inserting large table:', largeInsertError);
        } else {
          console.log('Successfully added a large table for 15 people');
        }
      } else {
        console.log(`${largeTables.length} large tables already exist`);
      }
    }
    
    console.log('Database initialization completed successfully');
    
  } catch (error) {
    console.error('Error in database initialization:', error);
  }
}

// Run the initialization
initializeDatabase();

// Export for use in other modules
export { supabase, initializeDatabase };
