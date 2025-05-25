'use client';

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User } from 'lucide-react';

export default function Home() {

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[90vh] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10 backdrop-blur-sm"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 animate-float"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}
        ></div>
        
        {/* Modern decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-float animation-delay-500"></div>
        
        {/* Light beam effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/5 via-gray-900/0 to-gray-900/0 pointer-events-none"></div>
        
        <div className="relative flex flex-col justify-center items-center h-full z-20 px-4 text-center">
          <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-white bg-white/10 backdrop-blur-md shadow-md mb-6 animate-scaleIn">PREMIER DINING EXPERIENCE</span>
          <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 mb-6 animate-fadeIn">
            Havana Restaurant
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto animate-fadeIn animation-delay-200 font-light">
            Experience the finest dining in town with our award-winning cuisine and elegant atmosphere
          </p>
          <div className="flex flex-col sm:flex-row gap-5 animate-fadeIn animation-delay-300">
            <Link href="/menu" 
              className="group relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">View Menu</span>
              <div className="absolute inset-0 w-0 group-hover:w-full bg-white/10 duration-300 transition-all"></div>
            </Link>
            <Link href="/order" 
              className="group relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <ShoppingCart size={20} />
                <span>Order Online</span>
              </span>
              <div className="absolute inset-0 w-0 group-hover:w-full bg-white/10 duration-300 transition-all"></div>
            </Link>
            <Link href="/reservation" 
              className="group relative bg-transparent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-glow backdrop-blur-md overflow-hidden border border-gray-200/30"
            >
              <span className="relative z-10">Make Reservation</span>
              <div className="absolute inset-0 w-0 group-hover:w-full bg-white/10 duration-300 transition-all"></div>
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Benefits Section */}
      <div className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
        <div className="max-w-7xl mx-auto text-center relative">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Create an Account?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Fast Ordering</h4>
              <p className="text-white/80">Save your favorite items and reorder with just one click</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Personal Profile</h4>
              <p className="text-white/80">Manage your orders, preferences, and delivery addresses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Exclusive Deals</h4>
              <p className="text-white/80">Get access to member-only discounts and special offers</p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/order"
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          <div className="animate-slideLeft">
            <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/30 backdrop-blur-sm shadow-sm mb-4">OUR HISTORY</span>
            <h2 className="text-3xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300">Our Restaurant Story</h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 font-light leading-relaxed backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-md border border-gray-100/50 dark:border-gray-700/50">
              <p>
                Founded in 2010, Havana Restaurant has been serving exceptional cuisine for over a decade. 
                Our passion for food and commitment to quality has made us one of the top dining destinations in the city.
              </p>
              <p>
                We source only the freshest ingredients from local farmers and suppliers to create memorable dishes 
                that combine traditional flavors with modern culinary techniques.
              </p>
              <Link href="/contact" className="inline-flex items-center group bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-xl">
                <span>Learn More</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')"}}
            ></div>
          </div>
        </div>
      </div>

      {/* Featured Menu Section */}
      <div className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/30 backdrop-blur-sm shadow-sm mb-4">CULINARY EXCELLENCE</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300">Featured Menu</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-light">
              Our signature dishes crafted with love and the finest ingredients
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Menu Item 1 */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover-lift transition-all duration-500 border border-gray-100/50 dark:border-gray-700/50 group animate-slideUp">
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-in-out group-hover:scale-105" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80')"}}></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">CHEF'S CHOICE</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Grilled Salmon</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 font-light">Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables</p>
                <div className="flex justify-between items-center">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 font-bold text-xl">$24.99</p>
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                    Mains
                  </span>
                </div>
              </div>
            </div>
            
            {/* Menu Item 2 */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover-lift transition-all duration-500 border border-gray-100/50 dark:border-gray-700/50 group animate-slideUp animation-delay-200">
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-in-out group-hover:scale-105" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80')"}}></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">POPULAR</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Margherita Pizza</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 font-light">Classic pizza with tomato sauce, fresh mozzarella, and basil</p>
                <div className="flex justify-between items-center">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 font-bold text-xl">$18.99</p>
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    Pizza
                  </span>
                </div>
              </div>
            </div>
            
            {/* Menu Item 3 */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover-lift transition-all duration-500 border border-gray-100/50 dark:border-gray-700/50 group animate-slideUp animation-delay-400">
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-in-out group-hover:scale-105" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">PREMIUM</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Beef Tenderloin</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 font-light">Prime beef tenderloin with red wine reduction and truffle mashed potatoes</p>
                <div className="flex justify-between items-center">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 font-bold text-xl">$32.99</p>
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                    Mains
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/menu" 
              className="group relative inline-flex items-center px-10 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <span className="relative z-10">View Full Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 w-0 group-hover:w-full bg-white/10 duration-300 transition-all"></div>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-800 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/30 backdrop-blur-sm shadow-sm mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300">What Our Customers Say</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-light">
              Don't just take our word for it - here's what our customers think
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Testimonial 1 */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 group animate-slideUp">
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-2 text-indigo-400/20 dark:text-indigo-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-4 mb-6 pl-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 shadow-md">
                    <div className="bg-gradient-to-br from-indigo-400 to-purple-600 w-full h-full flex items-center justify-center text-white font-bold text-xl">J</div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Hussien Moustafa</h4>
                    <div className="flex text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">"The food was absolutely Havana! The service was impeccable and the atmosphere was perfect for our anniversary dinner. Will definitely return soon!"</p>
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">Visited on May 10, 2025</div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 group animate-slideUp animation-delay-200">
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-2 text-purple-400/20 dark:text-purple-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-4 mb-6 pl-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-100 dark:border-purple-900 shadow-md">
                    <div className="bg-gradient-to-br from-purple-400 to-pink-600 w-full h-full flex items-center justify-center text-white font-bold text-xl">S</div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ahmed Ragab</h4>
                    <div className="flex text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">"I've dined at many restaurants, but Havana stands out. The flavors are unique and every dish is consistently amazing! The attention to detail and presentation is unmatched."</p>
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">Visited on June 15, 2025</div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 group animate-slideUp animation-delay-400">
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-2 text-pink-400/20 dark:text-pink-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-4 mb-6 pl-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-100 dark:border-pink-900 shadow-md">
                    <div className="bg-gradient-to-br from-pink-400 to-indigo-600 w-full h-full flex items-center justify-center text-white font-bold text-xl">M</div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Bisho Natig</h4>
                    <div className="flex text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">"The chef's special was incredible! My family and I had an amazing dining experience and will definitely be returning. The staff was attentive and the ambiance was perfect for our celebration."</p>
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">Visited on July 22, 2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-pink-500/20 to-indigo-500/20 blur-3xl"></div>
          
          {/* Floating blobs */}
          <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-white/10 animate-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-white/10 animate-float animation-delay-300"></div>
          <div className="absolute top-2/3 left-1/4 w-8 h-8 rounded-full bg-white/10 animate-float animation-delay-200"></div>
          
          {/* Light beam effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-white/0 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block p-1 bg-white/10 backdrop-blur-md rounded-full mb-6 animate-scaleIn">
            <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-white">RESERVE NOW</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white animate-fadeIn leading-tight">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Dining Experience</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/80 font-light animate-fadeIn animation-delay-200">
            Make a reservation today and indulge in an unforgettable culinary journey crafted just for you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeIn animation-delay-300">
            <Link href="/reservation" 
                className="group relative px-10 py-4 bg-gradient-to-r from-white/90 to-white/80 text-indigo-800 font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Reserve a Table
              </span>
              <div className="absolute inset-0 w-0 group-hover:w-full bg-indigo-100 duration-300 transition-all -z-0"></div>
            </Link>
            
            <Link href="/contact" 
                className="group relative px-10 py-4 bg-transparent backdrop-blur-sm text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-white/30"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                </svg>
                Contact Us
              </span>
              <div className="absolute inset-0 w-0 group-hover:w-full bg-white/20 duration-300 transition-all -z-0"></div>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-80">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white text-sm">Open Daily<br/>11am - 10pm</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-white text-sm">Reservations<br/>+201092289854</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-white text-sm">El Sadat Street<br/>Egypt, Aswan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
