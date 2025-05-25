// This script tests the configuration of the restaurant chatbot
// It verifies the chatbot is properly responding to messages

/**
 * Tests the chatbot configuration by making a test request to the API
 * @returns {Promise<boolean>} - True if the chatbot is configured correctly, false otherwise
 */
async function testApiKeyConfiguration() {
  console.log('%c🤖 Testing Restaurant Chatbot Configuration', 'color: blue; font-weight: bold; font-size: 14px;');
  
  try {
    console.log('Checking chatbot response system...');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Test message - please ignore' })
    });    const data = await response.json();
    
    if (!response.ok) {
      console.error('%c❌ Chatbot Configuration Error:', 'color: red; font-weight: bold;');
      console.error('  • Status:', response.status);
      console.error('  • Message:', data.message || 'Unknown error');
      
      if (data.error === 'Configuration error') {
        console.error('%c📝 Note:', 'color: orange; font-weight: bold;');
        console.error('  The chatbot is using a smart local response system and should work without configuration.');
        console.error('  Check server logs for more details on this error.');
      }
      return false;
    } 
    
    console.log('%c✅ Chatbot configuration is valid!', 'color: green; font-weight: bold;');
    console.log('  The restaurant chatbot should be working correctly.');
    return true;
  } catch (error) {
    console.error('%c❌ Network Error:', 'color: red; font-weight: bold;');
    console.error('  Could not connect to API:', error.message);
    console.error('  Make sure your development server is running.');
    return false;
  }
}

/**
 * Shows a browser notification about the API key status
 * @param {boolean} isValid - Whether the API key is valid
 */
function showApiKeyNotification(isValid) {  // Only show if we have permission
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(
        isValid ? 'GitHub AI Token: Valid' : 'GitHub AI Token: Missing', 
        {
          body: isValid 
            ? 'Your chatbot is properly configured and ready to use!' 
            : 'Please set up your GitHub AI token to enable the chatbot feature.',
          icon: '/favicon.ico'
        }
      );
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
}

// Export for using in components
export default testApiKeyConfiguration;

// Run the test automatically if this script is loaded directly
if (typeof window !== 'undefined') {
  if (window.location.pathname === '/support') {
    // We're on the support page, let's run the test after a short delay
    setTimeout(() => {
      testApiKeyConfiguration()
        .then(isValid => {
          if (process.env.NODE_ENV !== 'production') {
            showApiKeyNotification(isValid);
          }
        })
        .catch(console.error);
    }, 1500);
  }
}
