'use client';

import { useState } from 'react';
import { contactService } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
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
        ...formStatus,
        loading: true
      });
      
      // Submit form data to API
      await contactService.submitContactForm(formData);
      
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Thank you for your message! We will get back to you soon.',
        loading: false
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        submitted: true,
        error: true,
        message: error.message || 'There was an error submitting your message. Please try again.',
        loading: false
      });
    }
  };
  return (
    <div className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Contact Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl mb-16 shadow-xl">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')] bg-cover bg-center opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-pink-500/40 mix-blend-soft-light pointer-events-none"></div>
          
          <div className="relative z-20 py-20 px-6 text-center">
            <span className="inline-block py-1 px-6 rounded-full text-sm font-medium tracking-wider text-white bg-white/10 shadow-md mb-4 animate-scaleIn">GET IN TOUCH</span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white animate-fadeIn">
              Contact Us
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-light animate-fadeIn animation-delay-200">
              Have questions, feedback, or want to make a reservation? We'd love to hear from you.
            </p>
          </div>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Send Us a Message</h2>
            </div>
            
            {formStatus.submitted && (
              <div className={`mb-8 p-6 rounded-xl shadow-md ${
                formStatus.error 
                  ? 'bg-red-50/90 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-400' 
                  : 'bg-green-50/90 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-400'
              }`}>
                <div className="flex items-center">
                  {formStatus.error ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{formStatus.message}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Name *</label>
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
              
              <div className="mb-6">
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
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Subject</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all"
                  />
                </div>
              </div>
                <div className="mb-8">
                <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Message *</label>
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-start pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-lg bg-white/60 dark:bg-gray-900/60 text-gray-800 dark:text-white transition-all"
                    placeholder="How can we help you?"
                    required
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
            {/* Contact Information */}
          <div>
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 md:p-10 mb-10 border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 animate-slideRight">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400">Contact Information</h2>
              </div>
              
              <div className="space-y-8">
                <div className="group flex items-start transform hover:scale-[1.01] transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Address</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      El Sadat St, Aswan-Egypt
                    </p>
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                      <span>Get directions</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="group flex items-start transform hover:scale-[1.01] transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phone</h3>
                    <a href="tel:+201092289854" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      +201092289854
                    </a>
                  </div>
                </div>
                
                <div className="group flex items-start transform hover:scale-[1.01] transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email</h3>
                    <a href="mailto:info@delicious.com" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      info@delicious.com
                    </a>
                  </div>
                </div>
                
                <div className="group flex items-start transform hover:scale-[1.01] transition-transform">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hours</h3>
                    <div className="space-y-1 text-gray-600 dark:text-gray-300">
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
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden h-80 relative border border-gray-100/50 dark:border-gray-700/50 hover-lift transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/10 mix-blend-multiply z-10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative h-full w-full flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=CityVille,State&zoom=14&size=800x400&maptype=roadmap&markers=color:red%7Clabel:D%7CCityVille,State&key=YOUR_API_KEY')"}}>
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/20 z-30">
                  <div className="text-center text-white p-6 bg-black/40 rounded-2xl max-w-sm mx-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Find Us</h3>
                    <p className="mb-4">El Sadat St, Aswan-Egypt</p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
