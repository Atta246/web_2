// Script to initialize restaurant tables in the database
// Run this script to ensure the restaurant has enough tables for reservations

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize Supabase client
const supabaseUrl = 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeTables() {
  try {
    console.log('Checking for existing tables...');
    
    // Check if we already have tables
    const { data: existingTables, error: checkError } = await supabase
      .from('tables')
      .select('table_number, capacity')
      .eq('is_active', true);
      
    if (checkError) {
      console.error('Error checking for existing tables:', checkError);
      throw checkError;
    }
    
    if (existingTables && existingTables.length > 0) {
      console.log(`Found ${existingTables.length} existing tables.`);
      
      // Check for large capacity tables
      const largeTable = existingTables.find(table => table.capacity >= 10);
      if (!largeTable) {
        console.log('No large capacity tables found. Adding large table...');
        await addLargeTable('T12', 15, 'Banquet Hall');
      } else {
        console.log(`Found large table: ${largeTable.table_number} with capacity for ${largeTable.capacity} guests.`);
      }
    } else {
      console.log('No tables found. Creating default tables...');
      await createDefaultTables();
    }
    
    // Print current table configuration
    const { data: tables } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true)
      .order('capacity');
      
    console.log('Current table configuration:');
    console.table(tables);
    
    return tables;
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}

async function createDefaultTables() {
  const defaultTables = [
    { table_number: 'T1', capacity: 2, location: 'Window' },
    { table_number: 'T2', capacity: 2, location: 'Window' },
    { table_number: 'T3', capacity: 4, location: 'Main Floor' },
    { table_number: 'T4', capacity: 4, location: 'Main Floor' },
    { table_number: 'T5', capacity: 4, location: 'Window' },
    { table_number: 'T6', capacity: 6, location: 'Patio' },
    { table_number: 'T7', capacity: 6, location: 'Patio' },
    { table_number: 'T8', capacity: 8, location: 'Private Area' },
    { table_number: 'T9', capacity: 8, location: 'Main Floor' },
    { table_number: 'T10', capacity: 10, location: 'Private Room' },
    { table_number: 'T11', capacity: 12, location: 'Banquet Hall' },
    { table_number: 'T12', capacity: 15, location: 'Banquet Hall' }
  ];
  
  try {
    // Add each table to the database
    for (const table of defaultTables) {
      const { data, error } = await supabase
        .from('tables')
        .insert([{ 
          ...table, 
          is_active: true,
          is_reservable: true
        }]);
        
      if (error) {
        console.error(`Error adding table ${table.table_number}:`, error);
      } else {
        console.log(`Added table ${table.table_number} with capacity for ${table.capacity} guests.`);
      }
    }
    
    console.log('Default tables created successfully.');
  } catch (error) {
    console.error('Error creating default tables:', error);
    throw error;
  }
}

async function addLargeTable(tableNumber, capacity, location) {
  try {
    console.log(`Adding a large table with capacity for ${capacity} guests...`);
    
    // Check if table with this number already exists
    const { data: existingTable, error: checkError } = await supabase
      .from('tables')
      .select('*')
      .eq('table_number', tableNumber)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing table:', checkError);
      throw checkError;
    }
    
    // If table with this number exists, update it instead
    if (existingTable) {
      console.log(`Table ${tableNumber} already exists. Updating capacity...`);
      
      const { data: updatedTable, error: updateError } = await supabase
        .from('tables')
        .update({ capacity, location, is_active: true })
        .eq('table_id', existingTable.table_id)
        .select();
        
      if (updateError) {
        console.error('Error updating table:', updateError);
        throw updateError;
      }
      
      console.log('Table updated successfully:', updatedTable);
      return updatedTable;
    }
    
    // Otherwise, create a new large table
    const { data: newTable, error: insertError } = await supabase
      .from('tables')
      .insert([{ 
        table_number: tableNumber,
        capacity,
        location,
        is_active: true,
        is_reservable: true
      }])
      .select();
      
    if (insertError) {
      console.error('Error creating table:', insertError);
      throw insertError;
    }
    
    console.log('Large table created successfully:', newTable);
    return newTable;
  } catch (error) {
    console.error('Failed to add large table:', error);
    throw error;
  }
}

// Run the function if this script is executed directly
// Just run it directly without checking since import.meta.url isn't available in CommonJS
initializeTables()
  .then(() => console.log('Done initializing tables.'))
  .catch(error => console.error('Initialization failed:', error));

export { initializeTables, addLargeTable };
