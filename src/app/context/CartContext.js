'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  // Load cart from localStorage on mount
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('restaurantCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Validate the cart structure
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          // Clear corrupted data
          localStorage.removeItem('restaurantCart');
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('restaurantCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (menuItem, customizations = {}) => {
    // Validate input
    if (!menuItem || !menuItem.id || !menuItem.price) {
      console.error('Invalid menu item:', menuItem);
      return;
    }

    setCartItems(prevItems => {
      // Create a unique key for the item including customizations
      const itemKey = `${menuItem.id}-${JSON.stringify(customizations)}`;
      const existingItem = prevItems.find(item => 
        item.id === menuItem.id && 
        JSON.stringify(item.customizations || {}) === JSON.stringify(customizations)
      );
      
      if (existingItem) {
        // Update quantity if item already exists with same customizations
        return prevItems.map(item =>
          item.id === menuItem.id && 
          JSON.stringify(item.customizations || {}) === JSON.stringify(customizations)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { 
          ...menuItem, 
          name: menuItem.name,
          quantity: 1,
          customizations: customizations,
          uniqueKey: itemKey
        }];
      }
    });
  };

  const removeFromCart = (itemId, customizations = {}) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === itemId && 
          JSON.stringify(item.customizations || {}) === JSON.stringify(customizations))
      )
    );
  };

  const updateQuantity = (itemId, newQuantity, customizations = {}) => {
    // Validate input
    if (!itemId || typeof newQuantity !== 'number' || newQuantity < 0) {
      console.error('Invalid quantity update:', { itemId, newQuantity });
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId, customizations);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && 
        JSON.stringify(item.customizations || {}) === JSON.stringify(customizations)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('restaurantCart');
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return total + quantity;
    }, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return total + (price * quantity);
    }, 0);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value = {
    items: cartItems, // Alias for consistency with components
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isOpen,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
