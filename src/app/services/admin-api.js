'use client';

import supabase from '../lib/supabase';

// Admin services for dashboard functionality
export const adminService = {
  // Dashboard statistics
  getDashboardStats: async () => {
    try {
      // Get menu items count
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('item_id');
      
      if (menuError) throw new Error(`Menu error: ${menuError.message}`);
      
      // Get reservations with status counts
      const { data: reservations, error: reservationError } = await supabase
        .from('reservations')
        .select('reservation_id, date, time, status, created_at');
      
      if (reservationError) throw new Error(`Reservation error: ${reservationError.message}`);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const pendingCount = reservations?.filter(r => r.status === 'pending').length || 0;
      const completedCount = reservations?.filter(r => r.status === 'completed').length || 0;
      const todayCount = reservations?.filter(r => r.date === today).length || 0;
      
      // Get recent reservations (5 most recent)
      const recentReservations = [...(reservations || [])].sort((a, b) => {
        const dateA = a.created_at || a.date;
        const dateB = b.created_at || b.date;
        return new Date(dateB) - new Date(dateA);
      }).slice(0, 5);
      
      return {
        stats: {
          menuItems: menuItems?.length || 0,
          pendingReservations: pendingCount,
          completedReservations: completedCount,
          todayReservations: todayCount
        },
        recentReservations: recentReservations
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  
  // Admin profile management
  getAdminProfile: async (adminId) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', adminId)
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  },
  
  // Menu management
  getMenuItemsWithCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error fetching menu items with categories:', error);
      throw error;
    }
  },
  
  // Reservation management
  getReservationsWithDetails: async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error fetching reservations with details:', error);
      throw error;
    }
  },
  
  // Get available tables
  getAvailableTables: async (date, time) => {
    try {
      // Get all tables
      const { data: tables, error: tablesError } = await supabase
        .from('tables')
        .select('*');
      
      if (tablesError) throw new Error(tablesError.message);
      
      // Get reservations for the specified date and time
      const { data: bookedTables, error: reservationError } = await supabase
        .from('reservations')
        .select('table_id')
        .eq('date', date)
        .eq('time', time);
      
      if (reservationError) throw new Error(reservationError.message);
      
      // Filter out booked tables
      const bookedTableIds = bookedTables?.map(r => r.table_id) || [];
      const availableTables = tables?.filter(t => !bookedTableIds.includes(t.table_id)) || [];
      
      return availableTables;
    } catch (error) {
      console.error('Error fetching available tables:', error);
      throw error;
    }
  }
};
