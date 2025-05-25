// API route for reservations
import { withErrorHandling, successResponse, errorResponse, validateRequest, parseRequestBody } from '@/app/lib/api-utils';
import supabase from '@/app/lib/supabase-server';
import { verifyToken } from '@/app/lib/auth-utils';

export const GET = withErrorHandling(async (request) => {
  try {
    // Check if this is an authenticated request for admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Unauthorized - Authentication required to view all reservations', 401);
    }
    
    // Verify the token (in a real app)
    // const user = await verifyToken(authHeader.split(' ')[1]);
    // if (!user || user.role !== 'admin') {
    //   return errorResponse('Forbidden - Admin access required', 403);
    // }
    
    // Fetch reservations from Supabase
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        customer_profiles(profile_id, first_name, last_name, phone),
        tables(table_number, capacity, location)
      `)
      .order('reservation_date', { ascending: false })
      .order('start_time');
    
    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch reservations', 500);
    }
    
    return successResponse(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    return errorResponse('An unexpected error occurred', 500);
  }
});

export const POST = withErrorHandling(async (request) => {
  const body = await parseRequestBody(request);
  
  // Validate required fields for reservation from form
  const validation = validateRequest(body, [
    'name', 'email', 'phone', 'date', 'time', 'guests'
  ]);
  
  if (!validation.valid) {
    return errorResponse(validation.error, 400);
  }
  
  try {
    // For simplified reservation flow from the form
    // We'll find an available table for the requested time
      
    // Parse time for start time
    const timeParts = body.time.split(' ');
    let [hours, minutes] = timeParts[0].split(':').map(part => parseInt(part));
    const isPM = timeParts[1] === 'PM';
    
    if (isPM && hours < 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
    
    // Format start time
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    
    // End time is 2 hours after start time
    let endHours = hours + 2;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      // Handle the "more than 10" option and convert to number
    const guestCount = body.guests === 'more'
      ? 11 // Default to 11 for "more than 10" option
      : parseInt(body.guests);
    // Special handling for large parties (more than 10)
    if (body.guests === 'more') {
      return errorResponse('For parties larger than 10, please call us directly at (555) 123-4567 to arrange accommodations.', 400);
    }
    
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true)
      .gte('capacity', guestCount)
      .order('capacity', { ascending: true });
    
    if (tablesError) {
      return errorResponse('Error retrieving tables', 500);
    }
    
    // If no tables found, try to find the largest available table
    if (!tables || tables.length === 0) {
      // Get the largest table available
      const { data: largestTable, error: largestTableError } = await supabase
        .from('tables')
        .select('*')
        .eq('is_active', true)
        .order('capacity', { ascending: false })
        .limit(1);
      
      if (largestTableError || !largestTable || largestTable.length === 0) {
        return errorResponse('No tables available in the restaurant', 400);
      }
      
      // If we have large party, but our largest table can't accommodate them
      if (guestCount > largestTable[0].capacity) {
        return errorResponse(`Our largest table can only accommodate ${largestTable[0].capacity} guests. For parties of ${guestCount} or more, please contact us directly.`, 400);
      }
      
      return errorResponse('No suitable tables found for your party size', 400);
    }
    
    // Find an available table
    let availableTable = null;
    
    for (const table of tables) {
      // Check if this table is available
      const { data: existingReservations, error: checkError } = await supabase
        .from('reservations')
        .select('*')
        .eq('table_id', table.table_id)
        .eq('reservation_date', body.date)
        .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
        .neq('status', 'cancelled');
      
      if (checkError) {
        console.error('Error checking table availability:', checkError);
        continue;
      }
      
      if (!existingReservations || existingReservations.length === 0) {
        availableTable = table;
        break;
      }
    }
    
    if (!availableTable) {
      return errorResponse('No tables available for the requested time', 400);
    }
      // Check if a guest profile already exists with this email/phone
    const { data: existingProfile, error: searchError } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('phone', body.phone)
      .eq('is_guest', true)
      .maybeSingle();
      
    let guestProfile;
      
    if (!existingProfile) {
      // Create a temporary guest profile for non-registered users
      const { data: newGuestProfile, error: guestError } = await supabase
        .from('customer_profiles')
        .insert([{
          user_id: null, // No user ID for guest users
          first_name: body.name.split(' ')[0],
          last_name: body.name.split(' ').slice(1).join(' ') || '',
          phone: body.phone,
          email: body.email,
          preferences: body.occasion ? `Occasion: ${body.occasion}` : null,
          is_guest: true
        }])
        .select();
      
      if (guestError || !newGuestProfile) {
        console.error('Error creating guest profile:', guestError);
        return errorResponse('Failed to create customer profile', 500);
      }
      
      guestProfile = newGuestProfile;
    } else {
      guestProfile = [existingProfile];
    }
      // Create the reservation in Supabase
    const newReservation = {
      customer_id: guestProfile[0].profile_id,
      table_id: availableTable.table_id,
      reservation_date: body.date,
      start_time: startTime,
      end_time: endTime,
      party_size: guestCount, // Using the previously calculated guest count
      special_requests: body.specialRequests || null,
      status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('reservations')
      .insert([newReservation])
      .select(`
        *,
        customer_profiles(profile_id, first_name, last_name, phone),
        tables(table_number, capacity, location)
      `);
    
    if (error) {
      console.error('Supabase error creating reservation:', error);
      return errorResponse('Failed to create reservation', 500);
    }
    
    return successResponse(data[0], 201);
  } catch (err) {
    console.error('Unexpected error:', err);
    return errorResponse('An unexpected error occurred', 500);
  }
});
