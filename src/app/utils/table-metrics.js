// Script to generate table availability metrics
// Useful for restaurant management to analyze table usage and optimize seating arrangements

import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

// Initialize Supabase client
const supabaseUrl = 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generates a report of table usage and availability for a specified date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Table usage statistics
 */
async function generateTableMetrics(startDate, endDate) {
  try {
    // Default to last 30 days if no dates provided
    const start = startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const end = endDate || dayjs().format('YYYY-MM-DD');
    
    console.log(`Generating metrics for tables from ${start} to ${end}`);
    
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true);
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      throw tablesError;
    }
    
    // Get all reservations for the date range
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select(`
        *,
        tables(table_number, capacity, location)
      `)
      .gte('reservation_date', start)
      .lte('reservation_date', end)
      .neq('status', 'cancelled');
    
    if (reservationsError) {
      console.error('Error fetching reservations:', reservationsError);
      throw reservationsError;
    }
    
    // Generate metrics for each table
    const tableMetrics = tables.map(table => {
      // Filter reservations for this table
      const tableReservations = reservations.filter(res => res.table_id === table.table_id);
      
      // Calculate metrics
      const totalReservations = tableReservations.length;
      const totalGuests = tableReservations.reduce((sum, res) => sum + res.party_size, 0);
      const avgPartySize = totalReservations > 0 ? 
        (totalGuests / totalReservations).toFixed(1) : 0;
      
      // Calculate capacity utilization
      const capacityUtilization = totalReservations > 0 ? 
        ((avgPartySize / table.capacity) * 100).toFixed(1) : 0;
      
      // Group reservations by day of week to see popular days
      const dayCount = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
      tableReservations.forEach(res => {
        const day = dayjs(res.reservation_date).day();
        dayCount[day]++;
      });
      
      // Find the most popular day
      let mostPopularDay = 0;
      let maxCount = 0;
      Object.entries(dayCount).forEach(([day, count]) => {
        if (count > maxCount) {
          mostPopularDay = parseInt(day);
          maxCount = count;
        }
      });
      
      // Convert day number to name
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const popularDay = totalReservations > 0 ? dayNames[mostPopularDay] : 'N/A';
      
      return {
        table_id: table.table_id,
        table_number: table.table_number,
        capacity: table.capacity,
        location: table.location,
        total_reservations: totalReservations,
        total_guests: totalGuests,
        average_party_size: avgPartySize,
        capacity_utilization: `${capacityUtilization}%`,
        most_popular_day: popularDay
      };
    });
    
    // Sort tables by utilization (descending)
    tableMetrics.sort((a, b) => 
      parseFloat(b.capacity_utilization) - parseFloat(a.capacity_utilization)
    );
    
    // Calculate large party statistics
    const largePartyReservations = reservations.filter(res => res.party_size > 6);
    const largePartyStats = {
      total_large_parties: largePartyReservations.length,
      average_large_party_size: largePartyReservations.length > 0 ?
        (largePartyReservations.reduce((sum, res) => sum + res.party_size, 0) / largePartyReservations.length).toFixed(1) : 0,
      percent_of_all_reservations: reservations.length > 0 ?
        ((largePartyReservations.length / reservations.length) * 100).toFixed(1) : 0
    };
    
    return {
      period: { startDate: start, endDate: end },
      total_tables: tables.length,
      total_reservations: reservations.length,
      table_metrics: tableMetrics,
      large_party_statistics: largePartyStats
    };
  } catch (error) {
    console.error('Error generating table metrics:', error);
    throw error;
  }
}

// If script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const startDate = process.argv[2];
  const endDate = process.argv[3];
  
  generateTableMetrics(startDate, endDate)
    .then(metrics => console.log(JSON.stringify(metrics, null, 2)))
    .catch(err => console.error('Script failed:', err));
}

export { generateTableMetrics };
