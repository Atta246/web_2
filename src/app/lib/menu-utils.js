'use client';

/**
 * Utilities for menu management
 */

// Format menu item for display and database operations
export const formatMenuItem = (item) => {
  if (!item) return null;
  
  return {
    id: item.item_id || item.id,
    item_id: item.item_id || item.id,
    name: item.name || '',
    description: item.description || '',
    price: typeof item.price === 'number' ? item.price : parseFloat(item.price || 0),
    category: item.category || '',
    category_id: item.category_id || null,
    image: item.image_url || item.image || '',
    image_url: item.image_url || item.image || '',
    is_available: item.is_available !== false,
    is_featured: item.is_featured || false,
    preparation_time: item.preparation_time || item.prep_time || 0,
    created_at: item.created_at || new Date().toISOString()
  };
};

// Format menu item for Supabase insertion/update
export const formatMenuItemForDb = (formData) => {
  return {
    name: formData.name,
    description: formData.description,
    price: parseFloat(formData.price),
    category: formData.category,
    image_url: formData.image || formData.image_url,
    is_available: formData.is_available !== false,
    is_featured: formData.is_featured || false,
    preparation_time: formData.preparation_time || 0,
    // Map category to category_id if available
    category_id: formData.category_id || null
  };
};

// Format price display
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '$0.00';
  return `$${parseFloat(price).toFixed(2)}`;
};

// Get predefined menu categories
export const getMenuCategories = () => [
  'Starters',
  'Salads',
  'Soups',
  'Mains',
  'Pizza',
  'Pasta',
  'Burgers',
  'Sandwiches',
  'Sides',
  'Desserts',
  'Beverages',
  'Specials'
];
