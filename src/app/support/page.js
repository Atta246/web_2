'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from '../components/ChatMessage';
import { debugResponse } from '../lib/api-debug';

export default function Support() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to our restaurant support! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      console.log('Sending message to API:', input);
      // Send the chat message to the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage]
        }),
      });
      // First, get the response text safely
      const responseText = await response.text();
      
      // Then try to parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError, 'Response text:', responseText);
        console.error('Raw response text:', responseText);
        throw new Error('Failed to parse server response');
      }
      
      // Now check if the response was ok
      if (!response.ok) {
        console.error(`API error (${response.status}):`, data);
        throw new Error(data.error || `Error ${response.status}`);
      }
      
      // Check if the response contains the expected message
      if (!data.message) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid response format from API');
      }
      
      // Add the AI response to the chat messages
      setMessages(prev => [...prev, { role: 'system', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide a more helpful error message to the user
      const errorMessage = error.message && error.message.includes('parse')
        ? "Sorry, there was a technical issue connecting to our AI service. Our team has been notified."
        : "Sorry, I encountered an error processing your request. Please try again in a moment.";
        
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Restaurant Support
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have questions about our restaurant? Our AI assistant is here to help!
          </motion.p>
        </div>

        <motion.div 
          className="bg-gray-50 rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-96 overflow-y-auto p-4 sm:p-6 bg-white">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Send'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
