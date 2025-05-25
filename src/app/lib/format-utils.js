'use client';

/**
 * Utility functions for formatting and displaying data in the admin dashboard 
 */

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time for display
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // If it's already in a readable format like "7:00 PM", return it
  if (timeString.includes(':') && (timeString.includes('AM') || timeString.includes('PM'))) {
    return timeString;
  }
  
  // Try to parse as 24-hour time
  const timeParts = timeString.split(':');
  if (timeParts.length >= 2) {
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    if (!isNaN(hours) && !isNaN(minutes)) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12; // Convert to 12-hour format
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
  }
  
  // If all else fails, return the original
  return timeString;
};

// Format currency for display
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format phone number for display
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original if we can't format it
  return phone;
};

// Generate status badge CSS classes based on status
export const getStatusBadgeClasses = (status) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  
  switch (status?.toLowerCase()) {
    case 'pending':
      return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300`;
    case 'confirmed':
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
    case 'completed':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
    case 'no-show':
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
  }
};

// Check if a date is today
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  const today = new Date();
  const date = new Date(dateString);
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Get relative time description (e.g., "3 days ago", "in 2 hours")
export const getRelativeTimeDescription = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  
  if (diffDays === 0) {
    if (diffHours === 0) {
      if (diffMins === 0) {
        return 'just now';
      } else if (diffMins < 0) {
        return `${Math.abs(diffMins)} minute${Math.abs(diffMins) > 1 ? 's' : ''} ago`;
      } else {
        return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
      }
    } else if (diffHours < 0) {
      return `${Math.abs(diffHours)} hour${Math.abs(diffHours) > 1 ? 's' : ''} ago`;
    } else {
      return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    }
  } else if (diffDays < 0) {
    if (diffDays > -7) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} ago`;
    } else if (diffDays > -30) {
      const weeks = Math.round(Math.abs(diffDays) / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.round(Math.abs(diffDays) / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  } else {
    if (diffDays < 7) {
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 30) {
      const weeks = Math.round(diffDays / 7);
      return `in ${weeks} week${weeks > 1 ? 's' : ''}`;
    } else {
      const months = Math.round(diffDays / 30);
      return `in ${months} month${months > 1 ? 's' : ''}`;
    }
  }
};
