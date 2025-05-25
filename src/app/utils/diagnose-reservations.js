// Script to properly handle table availability errors
// This script will improve error handling in the reservation system

// Import necessary libraries
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client - note we're using anon key so this will respect RLS policies
const supabaseUrl = 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Analyzes existing tables and provides a report on available capacity
 * This helps identify if there's enough capacity for the expected reservation load
 */
async function analyzeTableCapacity() {
  try {
    console.log('Analyzing restaurant table capacity...');
    
    // Get all active tables
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true);
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return { error: tablesError };
    }
    
    if (!tables || tables.length === 0) {
      console.error('No active tables found in the system');
      return { error: 'No active tables found' };
    }
    
    // Calculate capacity metrics
    const tableCount = tables.length;
    const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0);
    const smallTables = tables.filter(t => t.capacity <= 4);
    const mediumTables = tables.filter(t => t.capacity > 4 && t.capacity <= 8);
    const largeTables = tables.filter(t => t.capacity > 8);
    
    // Check for duplicate table numbers (this can cause conflicts)
    const tableNumbers = tables.map(t => t.table_number);
    const uniqueTableNumbers = new Set(tableNumbers);
    const hasDuplicates = tableNumbers.length !== uniqueTableNumbers.size;
    
    const duplicateTableNumbers = hasDuplicates
      ? tableNumbers.filter((num, index) => tableNumbers.indexOf(num) !== index) 
      : [];
    
    // Generate recommendation based on analysis
    let recommendation = '';
    
    if (largeTables.length === 0) {
      recommendation += '• Consider adding at least one large table (10+ capacity) to accommodate larger groups.\n';
    }
    
    if (hasDuplicates) {
      recommendation += `• WARNING: Duplicate table numbers detected: ${duplicateTableNumbers.join(', ')}. This can cause reservation conflicts.\n`;
    }
    
    if (smallTables.length < 4) {
      recommendation += '• Add more small tables (2-4 capacity) for couples and small groups.\n';
    }
    
    // Prepare the report
    const report = {
      tableCount,
      totalCapacity,
      smallTablesCount: smallTables.length,
      mediumTablesCount: mediumTables.length,
      largeTablesCount: largeTables.length,
      hasDuplicateTableNumbers: hasDuplicates,
      duplicateTableNumbers: duplicateTableNumbers,
      recommendation
    };
    
    console.log('Table capacity analysis complete:');
    console.table({
      'Total Tables': tableCount,
      'Total Capacity': totalCapacity,
      'Small Tables (1-4)': smallTables.length,
      'Medium Tables (5-8)': mediumTables.length,
      'Large Tables (9+)': largeTables.length
    });
    
    if (recommendation) {
      console.log('\nRecommendations:');
      console.log(recommendation);
    }
    
    return report;
  } catch (error) {
    console.error('Error analyzing table capacity:', error);
    return { error: error.message };
  }
}

/**
 * Diagnose and fix reservation system issues
 */
async function diagnoseReservationIssues() {
  try {
    console.log('Diagnosing reservation system issues...');
    
    // Check if we have the required tables
    const capacityReport = await analyzeTableCapacity();
    
    if (capacityReport.error) {
      console.error('Could not analyze table capacity:', capacityReport.error);
      return;
    }
    
    // If there are duplicate table numbers, suggest a fix
    if (capacityReport.hasDuplicateTableNumbers) {
      console.log('\n⚠️ CRITICAL ISSUE: Duplicate table numbers detected');
      console.log('This is likely causing your table availability errors.');
      console.log('Suggested fixes:');
      console.log('1. Remove duplicate tables via the admin interface');
      console.log('2. Run database cleanup to make table numbers unique');
    }
    
    // Check for any active reservations that might be causing conflicts
    const today = new Date().toISOString().split('T')[0];
    const { data: activeReservations, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .gte('reservation_date', today)
      .neq('status', 'cancelled');
    
    if (reservationError) {
      console.error('Error fetching reservations:', reservationError);
      return;
    }
    
    console.log(`\nFound ${activeReservations?.length || 0} active future reservations`);
    
    // Check for reservations without valid tables
    const tableIds = capacityReport.tableCount > 0 ? tables.map(t => t.table_id) : [];
    const orphanedReservations = activeReservations?.filter(r => !tableIds.includes(r.table_id)) || [];
    
    if (orphanedReservations.length > 0) {
      console.log(`⚠️ WARNING: Found ${orphanedReservations.length} reservations referencing non-existent tables`);
      console.log('This may cause "No tables available" errors even when tables exist');
    }
    
    console.log('\nDiagnosis complete. See above for any issues found.');
  } catch (error) {
    console.error('Error diagnosing reservation issues:', error);
  }
}

// Run the diagnostics
diagnoseReservationIssues()
  .then(() => console.log('Diagnosis complete'))
  .catch(error => console.error('Error running diagnostics:', error));
