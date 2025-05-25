'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { menuService } from '../services/api';

// Fallback menu data in case API fails
const fallbackMenuItems = [
  {
    id: 1,
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
    price: 24.99,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
    price: 18.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
  },
  {
    id: 3,
    name: 'Beef Tenderloin',
    description: 'Prime beef tenderloin with red wine reduction and truffle mashed potatoes',
    price: 32.99,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  },
  {
    id: 4,
    name: 'Shrimp Pasta',
    description: 'Linguine with jumbo shrimp, cherry tomatoes, garlic, and white wine sauce',
    price: 22.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
  },
  {
    id: 5,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
    price: 12.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74'
  },
  {
    id: 6,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 9.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb'
  },  
  {
    id: 7,
    name: 'Brushetta',
    description: 'Grilled bread topped with tomatoes, garlic, olive oil, and basil',
    price: 10.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1572695157335-95ec0a5e8b5c'
  },
  {
    id: 8,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and marcarpone cream',
    price: 8.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9'
  },
  {
    id: 9,
    name: 'Vegetable Curry',
    description: 'Assorted vegetables in a rich curry sauce, served with basmatic rice',
    price: 16.99,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641'
  },
];

// Extract categories from menu items (will be replaced by actual API data)
const categories = ['All', 'Starters', 'Mains', 'Pasta', 'Pizza', 'Desserts'];

export default function Menu() {
  const [menuItems, setMenuItems] = useState(fallbackMenuItems);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(['All']);
  
  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await menuService.getAllItems();
        setMenuItems(data);
        
        // Extract unique categories from the menu items
        const categorySet = new Set(['All']);
        data.forEach(item => {
          if (item.menu_categories && item.menu_categories.name) {
            categorySet.add(item.menu_categories.name);
          }
        });
        setAvailableCategories(Array.from(categorySet));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Using fallback data.');
        // Keep fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);
  
  // Filter menu items based on selected category and search term
  const filteredMenu = menuItems.filter(item => {
    const itemCategory = item.menu_categories ? item.menu_categories.name : item.category; // Support both API data and fallback data
    const matchesCategory = selectedCategory === 'All' || itemCategory === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Banner for Menu */}
        <div className="relative overflow-hidden rounded-3xl mb-16 shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none"></div>
          
          <div className="relative z-20 py-20 px-6 text-center">
            <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-white bg-white/10 backdrop-blur-md shadow-md mb-4 animate-scaleIn">CULINARY EXCELLENCE</span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white animate-fadeIn">
              Our Menu
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-light animate-fadeIn animation-delay-200">
              Explore our diverse selection of dishes crafted with the finest ingredients and culinary expertise
            </p>
          </div>
        </div>
          {/* Search and Category Filters */}
        <div className="mb-12 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 dark:text-gray-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search our menu..."
              className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg dark:shadow-gray-900/30 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white transform hover:scale-105 hover:shadow-glow' 
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-gray-700 border border-gray-100/50 dark:border-gray-700/50 hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
          {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Modern loading skeleton
            Array(6).fill().map((_, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover-lift transition-all animate-pulse">
                <div className="h-60 bg-gradient-to-r from-gray-300/80 via-gray-200/80 to-gray-300/80 dark:from-gray-700/80 dark:via-gray-600/80 dark:to-gray-700/80"></div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-7 bg-gradient-to-r from-gray-300/80 to-gray-200/80 dark:from-gray-600/80 dark:to-gray-700/80 rounded-lg w-3/4"></div>
                    <div className="h-7 bg-gradient-to-r from-indigo-300/60 to-purple-300/60 dark:from-indigo-700/60 dark:to-purple-700/60 rounded-lg w-1/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg w-full mt-4"></div>
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg w-5/6 mt-2"></div>
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-600/80 rounded-lg w-4/6 mt-2"></div>
                  <div className="h-8 bg-gray-200/50 dark:bg-gray-700/50 rounded-full w-1/3 mt-6"></div>
                </div>
              </div>
            ))
          ) : filteredMenu.length > 0 ? (
            filteredMenu.map((item, index) => {
              const itemId = item.id || item.item_id; // Support both API data and fallback data
              const itemImage = item.image || item.image_url; // Support both API data and fallback data
              const itemCategory = item.menu_categories ? item.menu_categories.name : item.category; // Support both API data and fallback data
                return (                <div 
                  key={itemId} 
                  className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover-lift transition-all duration-500 border border-gray-100/50 dark:border-gray-700/50 animate-slideUp`}
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="relative group">                    <Link href={`/menu/${itemId}`}>
                      <div 
                        className="h-60 bg-cover bg-center transform transition-transform duration-700 ease-in-out group-hover:scale-105" 
                        style={{backgroundImage: `url(${itemImage})`}}
                      ></div>
                    </Link><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link href={`/menu/${itemId}`} className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <span className="inline-flex items-center bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/50 transition-all shadow-lg hover:shadow-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="p-8">                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        <Link href={`/menu/${itemId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 font-bold text-lg">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 font-light">{item.description}</p>
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                      {itemCategory}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50">
              <div className="flex flex-col items-center">
                {error ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300 text-xl font-medium mb-2">{error}</p>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300 text-xl font-medium mb-2">No menu items found</p>
                    <p className="text-gray-500 dark:text-gray-400">Try a different search term or category</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0"></div>
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl"></div>
          
          <div className="relative py-16 px-6 text-center z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">Ready to Experience Our Cuisine?</h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-10 font-light">
              Book your table now and embark on a culinary journey that will delight your senses
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/reservation" 
                className="group relative bg-white text-indigo-600 font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Make a Reservation</span>
                <div className="absolute inset-0 w-0 group-hover:w-full bg-gray-100 duration-300 transition-all"></div>
              </Link>
              <Link href="/contact" 
                className="group relative bg-transparent text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 hover:shadow-glow backdrop-blur-md overflow-hidden border border-white/30"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 w-0 group-hover:w-full bg-white/10 duration-300 transition-all"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
