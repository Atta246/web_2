'use client';

import { useState } from 'react';
import { reservationService } from '../services/api';

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    occasion: '',
    specialRequests: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: '',
    loading: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 21; hour++) {
      const hourStr = hour <= 12 ? hour : hour - 12;
      const period = hour < 12 ? 'AM' : 'PM';
      
      slots.push(`${hourStr}:00 ${period}`);
      slots.push(`${hourStr}:30 ${period}`);
    }
    return slots;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous messages
    setFormStatus({
      submitted: false,
      error: false,
      message: '',
      loading: false
    });
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setFormStatus({
        submitted: true,
        error: true,
        message: 'Please fill out all required fields.',
        loading: false
      });
      return;
    }
    
    try {
      setFormStatus({
        submitted: false,
        error: false,
        message: '',
        loading: true
      });
      
      // Submit reservation data to API
      const response = await reservationService.createReservation({
        ...formData,
        status: 'pending' // Default status for new reservations
      });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        occasion: '',
        specialRequests: ''
      });
      
      // Show success message
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Your reservation has been submitted successfully! We will contact you shortly to confirm.',
        loading: false
      });
      
    } catch (error) {
      console.error('Error creating reservation:', error);
      setFormStatus({
        submitted: true,
        error: true,
        message: error.message || 'There was an error submitting your reservation. Please try again or contact us directly.',
        loading: false
      });
    }
  };
  return (
    <div className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Banner for Reservation */}
        <div className="relative overflow-hidden rounded-3xl mb-16 shadow-xl">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0')] bg-cover bg-center opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-pink-500/40 mix-blend-soft-light pointer-events-none"></div>
          
          <div className="relative z-20 py-20 px-6 text-center">
            <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-white bg-white/10 shadow-md mb-4 animate-scaleIn">BOOK YOUR TABLE</span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white animate-fadeIn">
              Make a Reservation
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-light animate-fadeIn animation-delay-200">
              Reserve your table at Delicious Restaurant and enjoy a memorable dining experience
            </p>
          </div>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Reservation Form */}
          <div className="lg:col-span-3 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Table Reservation</h2>
            </div>
              {formStatus.submitted && (
              <div className={`mb-8 p-6 rounded-xl shadow-md ${
                formStatus.error 
                  ? 'bg-red-50/90 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-400' 
                  : 'bg-green-50/90 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-400'
              }`}>
                <div className="flex items-start">
                  {formStatus.error ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <span className={formStatus.error ? "font-medium" : ""}>{formStatus.message}</span>
                    {formStatus.error && formStatus.message.includes('largest table') && (
                      <div className="mt-2">
                        <a href="tel:+201092289854" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 font-medium">Call us at +201092289854</a> to arrange accommodations for larger groups.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Email *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="guests" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Number of Guests *</label>
                  <div className="relative">
                    <div className="absolute inset-y-45 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={(e) => {
                        handleChange(e);
                        // Show a helpful message for large parties
                        if (e.target.value === 'more') {
                          setFormStatus({
                            submitted: true,
                            error: false,
                            message: "For parties larger than 10, we recommend calling us directly to ensure we can accommodate your group properly.",
                            loading: false
                          });
                        } else if (formStatus.submitted && !formStatus.error) {
                          // Clear the message when selecting a different option
                          setFormStatus({
                            submitted: false,
                            error: false,
                            message: '',
                            loading: false
                          });
                        }
                      }}
                      className="w-full pl-12 pr-10 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all appearance-none"
                      style={{
                        backgroundImage: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ))}                      <option value="more">More than 10</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        For large parties (more than 10), direct phone reservations are recommended
                      </span>
                    </div>
                  </div>
                </div>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="date" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Date *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Time *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full pl-12 pr-10 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all appearance-none"
                      style={{
                        backgroundImage: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                      required
                    >
                      <option value="">Select a time</option>
                      {generateTimeSlots().map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
                <div className="mb-6">
                <label htmlFor="occasion" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Occasion (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all appearance-none"
                    style={{
                      backgroundImage: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  >
                    <option value="">Select an occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="business">Business Meeting</option>
                    <option value="dateNight">Date Night</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <label htmlFor="specialRequests" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Special Requests (Optional)</label>
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all"
                    placeholder="Let us know if you have any special requirements or requests"
                  ></textarea>
                </div>
              </div>
                <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl relative overflow-hidden group disabled:opacity-70"
                disabled={formStatus.loading}
              >
                <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"></span>
                <span className="relative flex items-center justify-center">
                  {formStatus.loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Reserve Table
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
              
              <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>* Required fields. We'll send a confirmation to your email shortly after submitting the form.</span>
                </p>
              </div>
            </form>
          </div>
            {/* Reservation Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 md:p-10 mb-10 border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 animate-slideRight">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400">Reservation Information</h2>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start transform hover:scale-[1.01] transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Opening Hours</h3>
                    <div className="text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                      <p className="flex items-center">
                        <span className="font-medium w-32">Monday - Friday:</span> 
                        <span>11:00 AM - 10:00 PM</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium w-32">Saturday - Sunday:</span> 
                        <span>10:00 AM - 11:00 PM</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start transform hover:scale-[1.01] transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reservation Policy</h3>
                    <ul className="text-gray-600 dark:text-gray-300 mt-2 space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Reservations are held for 15 minutes past the scheduled time
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        For parties of 6 or more, please call us directly
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Please inform us of any allergies or dietary restrictions
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start transform hover:scale-[1.01] transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Direct Reservations</h3>                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      For larger parties or special events, please contact us directly:
                    </p>
                    <a href="tel:+201092289854" className="inline-flex items-center mt-2 text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +201092289854
                    </a>
                  </div>
                </div>
              </div>
            </div>
              {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-xl h-72 relative group hover-lift transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-in-out group-hover:scale-105" 
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')"}}
              ></div>
              <div className="absolute bottom-4 left-4 right-4 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <h3 className="text-lg font-bold">Experience Our Atmosphere</h3>
                <p className="text-sm text-gray-200">Elegant dining in a comfortable setting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
