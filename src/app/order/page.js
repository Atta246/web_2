'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Filter, Search, Star, Clock, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { menuService } from '../services/api';
import CartSidebar from '../components/CartSidebar';
import AuthModal from '../components/AuthModal';

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { addToCart, getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useCustomerAuth();

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, selectedCategory, searchQuery]);  const loadMenuItems = async () => {
    try {
      setLoading(true);
      console.log('Loading menu items...');
      const items = await menuService.getAllItems();
      console.log('Received items:', items);
      
      if (!items || items.length === 0) {
        // Fallback sample data for testing
        const sampleItems = [
          {
            id: 1,
            name: 'Grilled Chicken Breast',
            description: 'Juicy grilled chicken breast seasoned with herbs and spices',
            price: 18.99,
            category: 'Main Course',
            is_available: true,
            is_featured: true,
            preparation_time: 25,
            image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400'
          },
          {
            id: 2,
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with caesar dressing and croutons',
            price: 12.99,
            category: 'Appetizer',
            is_available: true,
            is_featured: false,
            preparation_time: 10,
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
          },
          {
            id: 3,
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake topped with vanilla ice cream',
            price: 8.99,
            category: 'Dessert',
            is_available: true,
            is_featured: true,
            preparation_time: 5,
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
          },
          {
            id: 4,
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato, mozzarella, and fresh basil',
            price: 16.99,
            category: 'Main Course',
            is_available: true,
            is_featured: false,
            preparation_time: 20,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
          },
          {
            id: 5,
            name: 'Beef Burger',
            description: 'Juicy beef patty with lettuce, tomato, and special sauce',
            price: 14.99,
            category: 'Main Course',
            is_available: true,
            is_featured: true,
            preparation_time: 15,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
          },
          {
            id: 6,
            name: 'Fish Tacos',
            description: 'Fresh fish tacos with cabbage slaw and lime',
            price: 13.99,
            category: 'Main Course',
            is_available: true,
            is_featured: false,
            preparation_time: 18,
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400'
          }
        ];
        console.log('Using sample data');
        setMenuItems(sampleItems);
        setFilteredItems(sampleItems);
        return;
      }
      
      // Filter only available items for customers
      const availableItems = items.filter(item => item.is_available);
      console.log('Available items:', availableItems);
      setMenuItems(availableItems);
      setFilteredItems(availableItems);
    } catch (err) {
      console.error('Error loading menu items:', err);
      setError('Failed to load menu items. Showing sample menu.');
      
      // Show sample data even if API fails
      const sampleItems = [
        {
          id: 1,
          name: 'Grilled Chicken Breast',
          description: 'Juicy grilled chicken breast seasoned with herbs and spices',
          price: 18.99,
          category: 'Main Course',
          is_available: true,
          is_featured: true,
          preparation_time: 25,
          image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400'
        },
        {
          id: 2,
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with caesar dressing and croutons',
          price: 12.99,
          category: 'Appetizer',
          is_available: true,
          is_featured: false,
          preparation_time: 10,
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
        }
      ];
      setMenuItems(sampleItems);
      setFilteredItems(sampleItems);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getCategories = () => {
    const categories = ['All'];
    const uniqueCategories = [...new Set(menuItems.map(item => item.category).filter(Boolean))];
    return categories.concat(uniqueCategories);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    // Show a brief success message or animation
    console.log(`Added ${item.name} to cart`);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none"></div>
        <div className="text-center relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading delicious menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none"></div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Page Title and Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Online</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Choose from our delicious menu items</p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={18} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {getCategories().map((category) => (              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/60 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30'
                }`}
              >
                {category}
              </button>
            ))}          </div>
        </div>        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-amber-100/80 backdrop-blur-sm border border-amber-400/30 text-amber-700 rounded-lg">
            <p className="font-medium">Notice:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery || selectedCategory !== 'All' 
                ? 'No items found matching your criteria.' 
                : 'No menu items available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200/30 dark:border-gray-700/30 group hover:-translate-y-1 flex flex-col">
                {/* Item Details */}
                <div className="p-4 flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {item.name}
                    </h3>
                    {item.is_featured && (
                      <Star className="text-purple-500 fill-current" size={18} />
                    )}
                  </div>

                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      {formatPrice(item.price)}
                    </span>
                    {item.preparation_time > 0 && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="mr-1" />
                        {item.preparation_time}min
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Plus size={18} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
}
