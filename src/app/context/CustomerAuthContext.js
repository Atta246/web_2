'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const CustomerAuthContext = createContext();

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking current user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login({ email, password });
      
      if (data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: 'Login failed' };
      }
    } catch (error) {
      console.error('Customer login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      const data = await authService.signup({ email, password, name });
      
      if (data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: 'Signup failed' };
      }
    } catch (error) {
      console.error('Customer signup error:', error);
      return { 
        success: false, 
        message: error.message || 'Signup failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Customer logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    checkCurrentUser
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
