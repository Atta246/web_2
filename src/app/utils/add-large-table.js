// Utility to create a large table for group reservations
// Use this script when you need to add a large capacity table to the restaurant

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

// Initialize Supabase client with your project details
const supabaseUrl = 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Add a large capacity table to accommodate large groups
 * @param {string} tableNumber - The table identifier 
 * @param {number} capacity - How many people the table can seat
 * @param {string} location - Where the table is located in the restaurant
 * @returns {Promise<Object>} - The created table object
 */
async function addLargeTable(tableNumber = 'T15', capacity = 15, location = 'Banquet Hall') {
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
        is_active: true
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

// If script is run directly, execute the function
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    // Parse command line arguments for capacity and location
    let capacity = 15;
    let location = 'Banquet Hall';
    let tableNumber = 'T15';
    
    // Parse capacity from command line if provided
    if (process.argv[2] && !isNaN(parseInt(process.argv[2]))) {
      capacity = parseInt(process.argv[2]);
    }
    
    // Parse table number if provided
    if (process.argv[3]) {
      tableNumber = process.argv[3];
    }
    
    // Parse location if provided
    if (process.argv[4]) {
      location = process.argv[4];
    }
    
    addLargeTable(tableNumber, capacity, location)
      .then(() => console.log('Script completed.'))
      .catch(err => console.error('Script failed:', err));
  } catch (err) {
    console.error('Error running script:', err);
  }
}

export { addLargeTable };
