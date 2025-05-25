'use client';

import { useTheme } from '../context/ThemeContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { User, LogOut, ShoppingCart } from 'lucide-react';
import AuthModal from './AuthModal';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useCustomerAuth();
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleAuthClick = () => {
    setAuthModalOpen(true);
  };

  return (
    <nav className="glass backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center animate-fadeIn">
              <span className="text-2xl font-black text-gradient-primary">Havana</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-12">
              {[
                { name: 'Home', href: '/', delay: 'animation-delay-150' },
                { name: 'Menu', href: '/menu', delay: 'animation-delay-300' },
                { name: 'Order', href: '/order', delay: 'animation-delay-400' },
                { name: 'Reservation', href: '/reservation', delay: 'animation-delay-500' },
                { name: 'Contact', href: '/contact', delay: 'animation-delay-600' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={`${item.delay} animate-fadeIn border-transparent text-gray-700 dark:text-gray-200 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 relative group`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4 animation-delay-300 animate-fadeIn">
            {/* Cart Icon */}
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Customer Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full px-3 py-1 shadow-md">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-24 truncate">
                    {user?.user_metadata?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}

            <button 
              onClick={toggleTheme} 
              aria-label="Toggle dark mode"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 9.003 0 0012 21a9.003 9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-300 hover:bg-white/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden animate-scaleIn">
          <div className="pt-2 pb-3 space-y-1 mx-2 my-2 rounded-2xl overflow-hidden backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200/30 dark:border-gray-700/30">
            {[
              { name: 'Home', href: '/', delay: 'animation-delay-150', active: true },
              { name: 'Menu', href: '/menu', delay: 'animation-delay-300', active: false },
              { name: 'Order', href: '/order', delay: 'animation-delay-400', active: false },
              { name: 'Reservation', href: '/reservation', delay: 'animation-delay-500', active: false },
              { name: 'Contact', href: '/contact', delay: 'animation-delay-600', active: false },
            ].map((item, index) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`${item.delay} animate-fadeIn ${item.active 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                  : 'border-transparent border-l-4 text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                } block pl-3 pr-4 py-3 text-base font-medium transition-all duration-200`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Customer Authentication in Mobile Menu */}
            <div className="px-4 py-3 border-t border-gray-200/30 dark:border-gray-700/30 mt-2">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user?.user_metadata?.name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left py-2 px-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="flex items-center space-x-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Cart in Mobile Menu */}
            <div className="px-4 py-3 border-t border-gray-200/30 dark:border-gray-700/30">
              <Link 
                href="/order" 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200/30 dark:border-gray-700/30">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button 
                onClick={toggleTheme}
                aria-label="Toggle dark mode" 
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 9.003 0 0012 21a9.003 9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
      />
    </nav>
  );
}
