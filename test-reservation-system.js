// Test script to validate the reservation system is working properly
// Run this script after applying fixes to ensure everything is functioning

import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

// Initialize Supabase client
const supabaseUrl = 'https://ajcltqyqbspwqvkaewvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqY2x0cXlxYnNwd3F2a2Fld3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTM1NjUsImV4cCI6MjA2MjkyOTU2NX0.aete7roHyoFlUZQy6E_K1CDdA2eyc4k9hUYItcWwHDI';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Test the table availability check logic
 */
async function testTableAvailability() {
  try {
    console.log('\n===== Testing Table Availability =====');
    
    // Get a random active table
    const { data: tables, error: tableError } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true)
      .order('table_id', { ascending: true })
      .limit(1);
      
    if (tableError || !tables || tables.length === 0) {
      console.error('Error getting test table:', tableError || 'No tables found');
      return false;
    }
    
    const testTable = tables[0];
    console.log(`Using test table ${testTable.table_number} with capacity ${testTable.capacity}`);
    
    // Create test dates (tomorrow and day after)
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const dayAfter = dayjs().add(2, 'day').format('YYYY-MM-DD');
    
    // Test times
    const testTimes = [
      { start: '18:00:00', end: '20:00:00' }, // 6-8 PM
      { start: '19:00:00', end: '21:00:00' }  // 7-9 PM (overlapping)
    ];
    
    // 1. First test: Check if we can create a reservation for tomorrow
    console.log(`\nTest 1: Creating reservation for tomorrow (${tomorrow}) at ${testTimes[0].start}`);
    const res1 = await createTestReservation(testTable.table_id, tomorrow, testTimes[0].start, testTimes[0].end, 2);
    
    if (!res1.success) {
      console.error('Test 1 failed:', res1.error);
      return false;
    }
    console.log('Test 1 passed: Created first reservation');
    
    // 2. Second test: Try to create an overlapping reservation (should fail)
    console.log(`\nTest 2: Creating overlapping reservation for same day/table (${tomorrow}) at ${testTimes[1].start}`);
    const res2 = await createTestReservation(testTable.table_id, tomorrow, testTimes[1].start, testTimes[1].end, 2);
    
    if (res2.success) {
      console.error('Test 2 failed: Overlapping reservation was created when it should have been rejected');
      return false;
    }
    console.log('Test 2 passed: Overlapping reservation was correctly rejected');
    
    // 3. Third test: Create reservation for different day (should succeed)
    console.log(`\nTest 3: Creating reservation for different day (${dayAfter}) at ${testTimes[0].start}`);
    const res3 = await createTestReservation(testTable.table_id, dayAfter, testTimes[0].start, testTimes[0].end, 2);
    
    if (!res3.success) {
      console.error('Test 3 failed:', res3.error);
      return false;
    }
    console.log('Test 3 passed: Created reservation on different day');
    
    // Clean up test reservations
    await cleanupTestReservations([res1.data.reservation_id, res3.data.reservation_id]);
    
    return true;
  } catch (error) {
    console.error('Error testing table availability:', error);
    return false;
  }
}

/**
 * Test handling of large party reservations
 */
async function testLargePartyHandling() {
  try {
    console.log('\n===== Testing Large Party Handling =====');
    
    // Get largest table
    const { data: largestTable, error: tableError } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true)
      .order('capacity', { ascending: false })
      .limit(1);
      
    if (tableError || !largestTable || largestTable.length === 0) {
      console.error('Error getting largest table:', tableError || 'No tables found');
      return false;
    }
    
    const testTable = largestTable[0];
    console.log(`Largest available table is ${testTable.table_number} with capacity ${testTable.capacity}`);
    
    // Create test date (3 days from now)
    const testDate = dayjs().add(3, 'day').format('YYYY-MM-DD');
    
    // 1. Test: Reserve largest table with appropriate party size
    const partySize = testTable.capacity - 1;
    console.log(`\nTest 1: Reserving largest table for ${partySize} people (within capacity)`);
    
    const res1 = await createTestReservation(
      testTable.table_id, 
      testDate, 
      '19:00:00', 
      '21:00:00', 
      partySize
    );
    
    if (!res1.success) {
      console.error('Test 1 failed:', res1.error);
      return false;
    }
    console.log('Test 1 passed: Created large party reservation within capacity');
    
    // Clean up test reservation
    await cleanupTestReservations([res1.data.reservation_id]);
    
    return true;
  } catch (error) {
    console.error('Error testing large party handling:', error);
    return false;
  }
}

/**
 * Helper function to create a test reservation
 */
async function createTestReservation(tableId, date, startTime, endTime, partySize) {
  try {
    // First create a test guest profile
    const { data: guestProfile, error: profileError } = await supabase
      .from('customer_profiles')
      .insert([{
        user_id: null,
        first_name: 'Test',
        last_name: 'User',
        phone: '555-1234',
        email: 'test@example.com',
        is_guest: true
      }])
      .select();
      
    if (profileError || !guestProfile || guestProfile.length === 0) {
      return { success: false, error: profileError || 'Failed to create guest profile' };
    }
    
    // Create the test reservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert([{
        customer_id: guestProfile[0].profile_id,
        table_id: tableId,
        reservation_date: date,
        start_time: startTime,
        end_time: endTime,
        party_size: partySize,
        special_requests: 'Test reservation - please ignore',
        status: 'pending'
      }])
      .select();
      
    if (reservationError) {
      return { 
        success: false, 
        error: reservationError.message || 'Failed to create test reservation',
        details: reservationError
      };
    }
    
    return { success: true, data: reservation[0] };
  } catch (error) {
    return { success: false, error: error.message || 'Exception creating test reservation' };
  }
}

/**
 * Helper function to clean up test reservations
 */
async function cleanupTestReservations(reservationIds) {
  if (!reservationIds || reservationIds.length === 0) return;
  
  try {
    console.log(`Cleaning up ${reservationIds.length} test reservations...`);
    
    for (const id of reservationIds) {
      await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('reservation_id', id);
    }
  } catch (error) {
    console.error('Error cleaning up test reservations:', error);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('=== RESERVATION SYSTEM TEST SUITE ===');
  console.log('Running tests to verify system functionality...');
  
  const testResults = {
    tableAvailability: await testTableAvailability(),
    largePartyHandling: await testLargePartyHandling()
  };
  
  console.log('\n=== TEST SUMMARY ===');
  Object.entries(testResults).forEach(([test, passed]) => {
    console.log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  });
  
  const allPassed = Object.values(testResults).every(result => result);
  console.log(`\nOverall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return allPassed;
}

// Run the tests
runAllTests()
  .then(success => {
    if (success) {
      console.log('\n🎉 The reservation system is now working properly!');
    } else {
      console.log('\n⚠️ Some issues remain in the reservation system. Check the test failures.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Error running tests:', error);
    process.exit(1);
  });
