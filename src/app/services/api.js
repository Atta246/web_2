import supabase from '../lib/supabase';

// Menu API
export const menuService = {
  getAllItems: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Supabase error:', error);
        // Return sample data if database is not available
        return getSampleMenuItems();
      }
      
      if (!data || data.length === 0) {
        console.log('No data found in database, returning sample data');
        return getSampleMenuItems();
      }
      
      // Transform the data to match the expected format in the UI
      return data.map(item => ({
        id: item.item_id,
        item_id: item.item_id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category || 'Uncategorized',
        category_id: item.category_id || null,
        image: item.image_url,
        image_url: item.image_url,
        is_available: item.is_available !== false,
        is_featured: item.is_featured || false,
        preparation_time: item.preparation_time || 0
      }));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Return sample data if there's any error
      return getSampleMenuItems();
    }
  },
  
  // Get menu popularity report data
  getMenuPopularityReport: async (startDate, endDate) => {
    try {
      // In a real system, this would fetch order data related to menu items
      // For now, we'll return sample data
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
        
      if (error) throw new Error(error.message);
      
      // Generate sample popularity data
      return data.map(item => {
        const randomOrders = Math.floor(Math.random() * 50) + 1;
        let popularity = 'Low';
        if (randomOrders > 30) popularity = 'High';
        else if (randomOrders > 15) popularity = 'Medium';
        
        return {
          name: item.name,
          orders: randomOrders,
          popularity: popularity
        };
      }).sort((a, b) => b.orders - a.orders);
    } catch (error) {
      console.error('Error generating menu popularity report:', error);
      throw error;
    }
  },

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
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      throw error;
    }
  },  createItem: async (menuItem) => {
    try {
      // Format the menu item data to match the database schema
      // Note: item_id is removed because it's a GENERATED ALWAYS AS IDENTITY column
      // and cannot be manually set
      const formattedItem = {
        name: menuItem.name,
        description: menuItem.description,
        price: parseFloat(menuItem.price),
        category: menuItem.category,
        image_url: menuItem.image || menuItem.image_url,
        is_available: menuItem.is_available !== false,
        is_featured: menuItem.is_featured || false,
        preparation_time: menuItem.preparation_time || 0,
        // Set a valid category_id if available, otherwise use null
        category_id: menuItem.category_id || 1 // Using 1 as default category_id
      };

      const { data, error } = await supabase
        .from('menu_items')
        .insert([formattedItem])
        .select();

      if (error) throw new Error(error.message);

      // Transform the response to match the expected format in the UI
      return {
        id: data[0].item_id,
        item_id: data[0].item_id,
        name: data[0].name,
        description: data[0].description,
        price: data[0].price,
        category: data[0].category,
        category_id: data[0].category_id || null,
        image: data[0].image_url,
        image_url: data[0].image_url,
        is_available: data[0].is_available !== false,
        is_featured: data[0].is_featured || false,
        preparation_time: data[0].preparation_time || 0
      };
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },
  updateItem: async (id, menuItem) => {
    try {
      // For the update function, check if we're using the UI id or database item_id
      const itemId = menuItem.item_id || id;
        // Format the menu item data to match the database schema
      const formattedItem = {
        name: menuItem.name,
        description: menuItem.description,
        price: parseFloat(menuItem.price),
        category: menuItem.category,
        image_url: menuItem.image || menuItem.image_url,
        is_available: menuItem.is_available !== false,
        is_featured: menuItem.is_featured || false,
        preparation_time: menuItem.preparation_time || 0
      };

      const { data, error } = await supabase
        .from('menu_items')
        .update(formattedItem)
        .eq('item_id', itemId)
        .select();

      if (error) throw new Error(error.message);
      
      // Transform the response to match the expected format in the UI
      return {
        id: data[0].item_id,
        item_id: data[0].item_id,
        name: data[0].name,
        description: data[0].description,
        price: data[0].price,
        category: data[0].category,
        category_id: data[0].category_id || null,
        image: data[0].image_url,
        image_url: data[0].image_url,
        is_available: data[0].is_available !== false,
        is_featured: data[0].is_featured || false,
        preparation_time: data[0].preparation_time || 0
      };
    } catch (error) {
      console.error(`Error updating menu item ${id}:`, error);
      throw error;
    }
  },
  deleteItem: async (id) => {
    try {
      // Check if we're using the UI id or database item_id
      const itemId = typeof id === 'object' ? id.item_id : id;
      
      // Delete the menu item
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('item_id', itemId);

      if (error) throw new Error(error.message);

      return { success: true, id: itemId };
    } catch (error) {
      console.error(`Error deleting menu item ${id}:`, error);
      throw error;
    }
  }
};

// Reservation API
export const reservationService = {
  getAllReservations: async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false })
        .order('time');
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },
  
  // Get reservation report data (for reports page)
  getReservationsReport: async (startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date');
        
      if (error) throw new Error(error.message);
      
      // Group by date and calculate stats
      const reportByDate = {};
      data.forEach(reservation => {
        if (!reportByDate[reservation.date]) {
          reportByDate[reservation.date] = {
            date: reservation.date,
            totalReservations: 0,
            totalGuests: 0
          };
        }
        
        reportByDate[reservation.date].totalReservations += 1;
        reportByDate[reservation.date].totalGuests += parseInt(reservation.guests) || 0;
      });
      
      // Convert to array and sort by date
      return Object.values(reportByDate).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
    } catch (error) {
      console.error('Error generating reservation report:', error);
      throw error;
    }
  },
  getReservationById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('reservation_id', id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      throw error;
    }
  },

  createReservation: async (reservation) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservation])
        .select();

      if (error) throw new Error(error.message);

      return data[0];
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  updateReservation: async (id, reservation) => {
    try {
      const currentReservation = await reservationService.getReservationById(id);

      const checkReservation = {
        table_id: reservation.table_id || currentReservation.table_id,
        reservation_date: reservation.reservation_date || currentReservation.reservation_date,
        start_time: reservation.start_time || currentReservation.start_time,
        end_time: reservation.end_time || currentReservation.end_time
      };

      const { data: existingReservations, error: checkError } = await supabase
        .from('reservations')
        .select('*')
        .eq('table_id', checkReservation.table_id)
        .eq('reservation_date', checkReservation.reservation_date)
        .or(`start_time.lte.${checkReservation.end_time},end_time.gte.${checkReservation.start_time}`)
        .neq('status', 'cancelled')
        .neq('reservation_id', id);

      if (checkError) throw new Error(checkError.message);
      if (existingReservations?.length > 0) throw new Error('The table is already reserved during this time');

      const { data, error } = await supabase
        .from('reservations')
        .update(reservation)
        .eq('reservation_id', id)
        .select();

      if (error) throw new Error(error.message);

      return data[0];
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  },

  updateReservationStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('reservation_id', id)
        .select();
      if (error) throw new Error(error.message);
      return data[0];
    } catch (error) {
      console.error(`Error updating reservation status ${id}:`, error);
      throw error;
    }
  }
};

// Authentication
export const authService = {
  login: async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async ({ email, password, name }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'customer' } }
      });
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      return data?.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

// Contact
export const contactService = {
  submitContactForm: async (formData) => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Contact Form Submission',
          message: formData.message,
          status: 'new'
        }])
        .select();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

// Sample menu items for fallback when database is not available
function getSampleMenuItems() {
  return [
    {
      id: 1,
      item_id: 1,
      name: "Grilled Chicken Breast",
      description: "Perfectly seasoned grilled chicken breast served with roasted vegetables and herb butter",
      price: 18.99,
      category: "Main Course",
      category_id: 1,
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      is_available: true,
      is_featured: true,
    },
    {
      id: 2,
      item_id: 2,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with parmesan cheese, croutons, and our house-made Caesar dressing",
      price: 12.99,
      category: "Salads",
      category_id: 2,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      is_available: true,
      is_featured: false,
    },
    {
      id: 3,
      item_id: 3,
      name: "Chocolate Lava Cake",
      description: "Decadent chocolate cake with a molten center, served with vanilla ice cream",
      price: 8.99,
      category: "Desserts",
      category_id: 3,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      is_available: true,
      is_featured: true,
    },
    {
      id: 4,
      item_id: 4,
      name: "Margherita Pizza",
      description: "Classic pizza with fresh mozzarella, tomato sauce, and basil leaves",
      price: 16.99,
      category: "Pizza",
      category_id: 4,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      is_available: true,
      is_featured: false,
    },
    {
      id: 5,
      item_id: 5,
      name: "Beef Burger",
      description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
      price: 14.99,
      category: "Burgers",
      category_id: 5,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      is_available: true,
      is_featured: true,
    },
    {
      id: 6,
      item_id: 6,
      name: "Fish Tacos",
      description: "Grilled fish with cabbage slaw, pico de gallo, and chipotle mayo in corn tortillas",
      price: 13.99,
      category: "Mexican",
      category_id: 6,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      is_available: true,
      is_featured: false,
    }
  ];
}
     