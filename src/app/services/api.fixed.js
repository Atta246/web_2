// API services for interacting with the backend
// This is an improved version of the API service with better error handling
// and fixes for the table availability issues
import supabase from '../lib/supabase';

// Menu API endpoints (unchanged)
export const menuService = {
  // Get all menu items
  getAllItems: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories(name, description)
        `)
        .order('name');
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch menu items');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },
  
  // Get menu item by ID
  getItemById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories(name, description),
          menu_item_ingredients(
            quantity,
            ingredients(name, unit, allergen_information)
          )
        `)
        .eq('item_id', id)
        .single();
      
      if (error) {
        throw new Error(error.message || `Failed to fetch menu item ${id}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      throw error;
    }
  },

  // Create new menu item
  createItem: async (menuItem) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([menuItem])
        .select();
      
      if (error) {
        throw new Error(error.message || 'Failed to create menu item');
      }
      
      // If there are ingredients, add them to the junction table
      if (menuItem.ingredients && menuItem.ingredients.length > 0 && data[0].item_id) {
        const ingredientMappings = menuItem.ingredients.map(ing => ({
          item_id: data[0].item_id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity
        }));
        
        const { error: ingredientError } = await supabase
          .from('menu_item_ingredients')
          .insert(ingredientMappings);
          
        if (ingredientError) {
          console.error('Error adding ingredients:', ingredientError);
        }
      }
      
      return data[0];
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  // Update menu item
  updateItem: async (id, menuItem) => {
    try {
      // Update the menu item base info
      const { data, error } = await supabase
        .from('menu_items')
        .update(menuItem)
        .eq('item_id', id)
        .select();
      
      if (error) {
        throw new Error(error.message || `Failed to update menu item ${id}`);
      }
      
      // If there are ingredients, update the junction table
      if (menuItem.ingredients && menuItem.ingredients.length > 0) {
        // First delete existing relationships
        await supabase
          .from('menu_item_ingredients')
          .delete()
          .eq('item_id', id);
        
        // Then add the new ones
        const ingredientMappings = menuItem.ingredients.map(ing => ({
          item_id: id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity
        }));
        
        const { error: ingredientError } = await supabase
          .from('menu_item_ingredients')
          .insert(ingredientMappings);
          
        if (ingredientError) {
          console.error('Error updating ingredients:', ingredientError);
        }
      }
      
      return data[0];
    } catch (error) {
      console.error(`Error updating menu item ${id}:`, error);
      throw error;
    }
  },

  // Delete menu item
  deleteItem: async (id) => {
    try {
      // First remove ingredient relations
      await supabase
        .from('menu_item_ingredients')
        .delete()
        .eq('item_id', id);
        
      // Then delete the menu item
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('item_id', id);
      
      if (error) {
        throw new Error(error.message || `Failed to delete menu item ${id}`);
      }
      
      return { success: true, id };
    } catch (error) {
      console.error(`Error deleting menu item ${id}:`, error);
      throw error;
    }
  }
};

// Reservation API endpoints - with improved error handling
export const reservationService = {
  // Get all reservations
  getAllReservations: async () => {
    try {
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
        throw new Error(error.message || 'Failed to fetch reservations');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  // Get reservation by ID
  getReservationById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          customer_profiles(profile_id, first_name, last_name, phone, email:users(email)),
          tables(table_number, capacity, location)
        `)
        .eq('reservation_id', id)
        .single();
      
      if (error) {
        throw new Error(error.message || `Failed to fetch reservation ${id}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      throw error;
    }
  },
  
  // Create new reservation - improved error handling
  createReservation: async (reservation) => {
    try {
      // For simplified reservation flow from the form
      // We'll find an available table for the requested time
      
      // First, we need to convert the date/time format
      const reservationDate = reservation.date;
      const timeString = reservation.time;
      
      // Parse time for start time
      const timeParts = timeString.split(' ');
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
      
      // Special handling for large parties (more than 10)
      if (reservation.guests === 'more') {
        throw new Error('For parties larger than 10, please call us directly at (555) 123-4567 to arrange accommodations.');
      }
      
      // Convert guests to number
      const guestCount = parseInt(reservation.guests);
      
      // Get all tables with enough capacity, avoiding duplicates by using distinct 
      try {
        const { data: tables, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .eq('is_active', true)
          .gte('capacity', guestCount)
          .order('capacity', { ascending: true });
        
        if (tablesError) {
          console.error('Error fetching tables:', tablesError);
          throw new Error('Error retrieving tables');
        }
        
        // If no tables found with enough capacity, try to find the largest available table
        if (!tables || tables.length === 0) {
          const { data: largestTable, error: largestTableError } = await supabase
            .from('tables')
            .select('*')
            .eq('is_active', true)
            .order('capacity', { ascending: false })
            .limit(1);
          
          if (largestTableError || !largestTable || largestTable.length === 0) {
            throw new Error('No tables available in the restaurant');
          }
          
          // If we have large party, but our largest table can't accommodate them
          if (guestCount > largestTable[0].capacity) {
            throw new Error(`Our largest table can only accommodate ${largestTable[0].capacity} guests. For parties of ${guestCount} or more, please contact us directly.`);
          }
          
          throw new Error('No tables available with enough capacity for your party size');
        }
        
        // Filter out tables with duplicate table_id to prevent conflicts
        const uniqueTables = [];
        const seenTableIds = new Set();
        
        for (const table of tables) {
          if (!seenTableIds.has(table.table_id)) {
            seenTableIds.add(table.table_id);
            uniqueTables.push(table);
          }
        }
        
        // Find an available table
        let availableTable = null;
        let lastCheckError = null;
        
        for (const table of uniqueTables) {
          try {
            // Check if this table is available at the requested time
            const { data: existingReservations, error: checkError } = await supabase
              .from('reservations')
              .select('*')
              .eq('table_id', table.table_id)
              .eq('reservation_date', reservationDate)
              .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
              .neq('status', 'cancelled');
            
            if (checkError) {
              console.error('Error checking table availability:', checkError);
              lastCheckError = checkError;
              continue;
            }
            
            // If no conflicting reservations found, we can use this table
            if (!existingReservations || existingReservations.length === 0) {
              availableTable = table;
              break;
            }
          } catch (checkingError) {
            console.error('Exception checking table availability:', checkingError);
            lastCheckError = checkingError;
            // Continue to next table instead of breaking the loop
            continue;
          }
        }
        
        // If no table is available, provide helpful error message
        if (!availableTable) {
          if (lastCheckError) {
            console.error('Last table check error:', lastCheckError);
            throw new Error('Error checking table availability. Please try again later.');
          }
          throw new Error('No tables available for the requested time. Please select a different time or date.');
        }
        
        // Check if a guest profile already exists with this email/phone
        const { data: existingProfile, error: searchError } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('phone', reservation.phone)
          .eq('is_guest', true)
          .maybeSingle();
          
        let guestProfile;
          
        if (!existingProfile) {
          // Create a temporary guest profile for non-registered users
          const { data: newGuestProfile, error: guestError } = await supabase
            .from('customer_profiles')
            .insert([{
              user_id: null, // No user ID for guest users
              first_name: reservation.name.split(' ')[0],
              last_name: reservation.name.split(' ').slice(1).join(' ') || '',
              phone: reservation.phone,
              email: reservation.email,
              preferences: reservation.occasion ? `Occasion: ${reservation.occasion}` : null,
              is_guest: true
            }])
            .select();
          
          if (guestError || !newGuestProfile) {
            console.error('Error creating guest profile:', guestError);
            throw new Error('Failed to create customer profile');
          }
          
          guestProfile = newGuestProfile;
        } else {
          guestProfile = [existingProfile];
        }
        
        // Create the reservation
        const newReservation = {
          customer_id: guestProfile[0].profile_id,
          table_id: availableTable.table_id,
          reservation_date: reservationDate,
          start_time: startTime,
          end_time: endTime,
          party_size: guestCount,
          special_requests: reservation.specialRequests || null,
          status: 'pending'
        };
        
        const { data, error } = await supabase
          .from('reservations')
          .insert([newReservation])
          .select();
        
        if (error) {
          throw new Error(error.message || 'Failed to create reservation');
        }
        
        return data[0];
      } catch (tableError) {
        console.error('Error in table availability process:', tableError);
        throw tableError;
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  // Update reservation - unchanged
  updateReservation: async (id, reservation) => {
    try {
      // If changing date/time/table, check availability
      if (reservation.table_id && (reservation.reservation_date || reservation.start_time || reservation.end_time)) {
        const currentReservation = await this.getReservationById(id);
        
        // Use the new values or fall back to current values
        const checkReservation = {
          table_id: reservation.table_id || currentReservation.table_id,
          reservation_date: reservation.reservation_date || currentReservation.reservation_date,
          start_time: reservation.start_time || currentReservation.start_time,
          end_time: reservation.end_time || currentReservation.end_time
        };
        
        // Check for conflicts
        const { data: existingReservations, error: checkError } = await supabase
          .from('reservations')
          .select('*')
          .eq('table_id', checkReservation.table_id)
          .eq('reservation_date', checkReservation.reservation_date)
          .or(`start_time.lte.${checkReservation.end_time},end_time.gte.${checkReservation.start_time}`)
          .neq('status', 'cancelled')
          .neq('reservation_id', id); // Exclude the current reservation
        
        if (checkError) {
          throw new Error(checkError.message || 'Failed to check table availability');
        }
        
        if (existingReservations && existingReservations.length > 0) {
          throw new Error('The table is already reserved during this time');
        }
      }
      
      // Update the reservation
      const { data, error } = await supabase
        .from('reservations')
        .update(reservation)
        .eq('reservation_id', id)
        .select();
      
      if (error) {
        throw new Error(error.message || `Failed to update reservation ${id}`);
      }
      
      return data[0];
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  },

  // Update reservation status - unchanged
  updateReservationStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('reservation_id', id)
        .select();
      
      if (error) {
        throw new Error(error.message || `Failed to update reservation status ${id}`);
      }
      
      return data[0];
    } catch (error) {
      console.error(`Error updating reservation status ${id}:`, error);
      throw error;
    }
  }
};

// Authentication service (unchanged)
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      // Use Supabase auth for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        throw new Error(error.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Sign up
  signup: async (credentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: 'customer'
          }
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  // Logout
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message || 'Logout failed');
      }
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new Error(error.message || 'Failed to get current user');
      }
      
      return data?.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

// Contact API endpoints (unchanged)
export const contactService = {
  // Submit contact form
  submitContactForm: async (formData) => {
    try {
      // Insert the contact form data into Supabase
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject || 'Contact Form Submission',
            message: formData.message,
            status: 'new'
          }
        ])
        .select();
      
      if (error) {
        throw new Error(error.message || 'Failed to submit contact form');
      }
      
      return data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};
