'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

export default function CartSidebar({ isOpen, onClose }) {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();
  
  const { isAuthenticated } = useCustomerAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isOpen || !isMounted) return null;  
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      // Proceed to checkout page using router for client-side navigation
      router.push('/checkout');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Overlay with animation */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar with slide-in animation */}
      <div className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-purple-500" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!items || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <ShoppingBag size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-center max-w-xs">
                Add some delicious items from our menu to get started!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.uniqueKey || `${item.id}-${JSON.stringify(item.customizations)}`} 
                  className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    {/* Item Image */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1 py-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-medium mt-1">
                        {formatPrice(item.price * item.quantity)} ({item.quantity} × {formatPrice(item.price)})
                      </p>
                      
                      {/* Customizations */}
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <div className="mt-1 space-y-1">
                          {Object.entries(item.customizations).map(([key, value]) => (
                            <p key={key} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : value}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.customizations)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.customizations)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items && items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-white/80 dark:bg-gray-800/80">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white">
              <span>Total:</span>
              <span className="text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">
                {formatPrice(totalPrice)}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}