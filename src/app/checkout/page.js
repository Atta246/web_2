'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Check, X, Info, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import AuthModal from '../components/AuthModal';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useCustomerAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    saveInfo: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Only redirect if no items in cart
    if (isMounted && (!items || items.length === 0)) {
      router.push('/menu');
      return;
    }
    
    // Pre-fill form if user data is available
    if (user) {
      setFormData(prev => ({
        ...prev,
        cardHolder: user.user_metadata?.name || '',
      }));
    }
  }, [items, router, user, isMounted]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    // Handle card number formatting (space after every 4 digits)
    if (name === 'cardNumber') {
      const sanitizedValue = value.replace(/[^\d]/g, '');
      const formattedValue = sanitizedValue
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Handle expiry date formatting (MM/YY)
    if (name === 'expiryDate') {
      const sanitizedValue = value.replace(/[^\d]/g, '');
      if (sanitizedValue.length <= 2) {
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      } else {
        const month = sanitizedValue.slice(0, 2);
        const year = sanitizedValue.slice(2, 4);
        setFormData(prev => ({ ...prev, [name]: `${month}/${year}` }));
      }
      return;
    }
    
    // Handle CVV (limit to 3-4 digits)
    if (name === 'cvv') {
      const sanitizedValue = value.replace(/[^\d]/g, '').slice(0, 4);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      return;
    }
    
    // Default handling for other fields
    setFormData(prev => ({ ...prev, [name]: inputValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call to process payment and create order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Order successful!
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrors({ 
        submit: 'There was an error processing your payment. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate card details
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      
      if (!formData.cardHolder) {
        newErrors.cardHolder = 'Cardholder name is required';
      }
      
      if (!formData.expiryDate || formData.expiryDate.length < 5) {
        newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
      } else {
        const [month, year] = formData.expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          newErrors.expiryDate = 'Month must be between 01-12';
        } else if (
          (parseInt(year) < currentYear) || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          newErrors.expiryDate = 'Card has expired';
        }
      }
      
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Valid CVV is required';
      }
    }
    
    // Validate shipping info
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isMounted) {
    return null;
  }

  // If order has been placed successfully
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-6">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Order Confirmed!
            </h1>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
              Thank you for your order. Your food is being prepared with care.
            </p>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              You will receive an email confirmation shortly.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/menu" className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Browse Menu
              </Link>
              <Link href="/" className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 mb-6">
              <CreditCard className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Sign in to Checkout
            </h1>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
              Please sign in to complete your purchase.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setShowAuthModal(true)}
                className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
              <button 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto sm:max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <Link href="/menu" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Checkout
            </h1>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Order Summary
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item) => (
                    <li key={item.uniqueKey || `${item.id}-${JSON.stringify(item.customizations)}`} className="py-4 flex">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-md" 
                        />
                      )}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <div className="mt-1">
                            {Object.entries(item.customizations).map(([key, value]) => (
                              <p key={key} className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : value}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                    <p>Subtotal</p>
                    <p>{formatPrice(getTotalPrice())}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <p>Shipping</p>
                    <p>Free</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <p>Tax</p>
                    <p>{formatPrice(getTotalPrice() * 0.08)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white mt-4">
                    <p>Total</p>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      {formatPrice(getTotalPrice() * 1.08)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Payment Method
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4">
                <div 
                  className={`relative rounded-lg border p-4 flex cursor-pointer ${
                    paymentMethod === 'creditCard' 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setPaymentMethod('creditCard')}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === 'creditCard'}
                      onChange={() => setPaymentMethod('creditCard')}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Credit / Debit Card
                    </label>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8 w-12 object-contain" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8 w-12 object-contain" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-8 w-12 object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Payment Details
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {paymentMethod === 'creditCard' && (
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Card Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`block w-full pr-10 focus:outline-none sm:text-sm rounded-md ${
                          errors.cardNumber
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CreditCard className={`h-5 w-5 ${errors.cardNumber ? 'text-red-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cardholder Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="John Doe"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        className={`block w-full focus:outline-none sm:text-sm rounded-md ${
                          errors.cardHolder
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        }`}
                      />
                    </div>
                    {errors.cardHolder && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.cardHolder}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expiry Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={`block w-full focus:outline-none sm:text-sm rounded-md ${
                          errors.expiryDate
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        }`}
                      />
                    </div>
                    {errors.expiryDate && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CVV
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={`block w-full focus:outline-none sm:text-sm rounded-md ${
                          errors.cvv
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => alert('The CVV is a 3-4 digit code found on the back of your card.')}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {errors.cvv && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Information</h3>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="123 Main St, Apt 4B"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`block w-full focus:outline-none sm:text-sm rounded-md ${
                        errors.address
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.address}</p>
                  )}
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`block w-full focus:outline-none sm:text-sm rounded-md ${
                        errors.city
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.city}</p>
                  )}
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Postal Code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      placeholder="10001"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`block w-full focus:outline-none sm:text-sm rounded-md ${
                        errors.postalCode
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      }`}
                    />
                  </div>
                  {errors.postalCode && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.postalCode}</p>
                  )}
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`block w-full focus:outline-none sm:text-sm rounded-md ${
                        errors.country
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400'
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      }`}
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                  {errors.country && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.country}</p>
                  )}
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <input
                        id="saveInfo"
                        name="saveInfo"
                        type="checkbox"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="saveInfo" className="text-sm text-gray-700 dark:text-gray-300">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {errors.submit && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-400">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end">
                <Link
                  href="/menu"
                  className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
