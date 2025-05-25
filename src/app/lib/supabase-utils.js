/**
 * Utilities for working with Supabase database
 * Handles common database operations for the restaurant admin system
 */

// Formats reservation data for consistent consumption across the app
export const formatReservation = (reservation) => {
  if (!reservation) return null;

  return {
    id: reservation.reservation_id,
    reservation_id: reservation.reservation_id,
    name: reservation.name || 'Guest',
    email: reservation.email || '',
    phone: reservation.phone || '',
    date: reservation.date || '',
    time: reservation.time || '',
    guests: reservation.guests || 0,
    special_requests: reservation.special_requests || reservation.message || '',
    status: reservation.status || 'pending',
    table_id: reservation.table_id || null,
    created_at: reservation.created_at || new Date().toISOString()
  };
};

// Formats menu item data for consistent consumption across the app
export const formatMenuItem = (menuItem) => {
  if (!menuItem) return null;

  return {
    id: menuItem.item_id,
    item_id: menuItem.item_id,
    name: menuItem.name || '',
    description: menuItem.description || '',
    price: menuItem.price || 0,
    category_id: menuItem.category_id || null,
    image_url: menuItem.image_url || null,
    is_available: menuItem.is_available !== false, // Default to true if not specified
    is_featured: menuItem.is_featured || false,
    prep_time: menuItem.preparation_time || 0
  };
};

// Function to check if a table is available at a given time and date
export const isTableAvailable = async (supabase, tableId, date, time, excludeReservationId = null) => {
  if (!tableId || !date || !time) return false;
  
  let query = supabase
    .from('reservations')
    .select('reservation_id')
    .eq('table_id', tableId)
    .eq('date', date)
    .eq('time', time)
    .neq('status', 'cancelled');
  
  if (excludeReservationId) {
    query = query.neq('reservation_id', excludeReservationId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error checking table availability:', error);
    return false;
  }
  
  return data.length === 0; // Table is available if no conflicting reservations
};

// Function to parse ISO date string to locale date display format
export const formatDateDisplay = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

// Get today's date in ISO format (YYYY-MM-DD)
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};

// Handle Supabase error responses
export const handleSupabaseError = (error, defaultMessage = 'An error occurred') => {
  console.error('Supabase error:', error);
  return {
    success: false,
    message: error?.message || error?.error_description || defaultMessage,
    error
  };
};

// Format success response
export const successResponse = (data, message = 'Operation successful') => {
  return {
    success: true,
    message,
    data
  };
};
