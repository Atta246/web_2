// This file contains simple fallback responses when OpenAI API is not available

// Restaurant information for fallback responses
const restaurantInfo = {
  name: "Delicious Restaurant",
  address: "123 Main Street, Foodville, CA 94123",
  phone: "(123) 456-7890",
  hours: {
    monday: "11:00 AM - 9:00 PM",
    tuesday: "11:00 AM - 9:00 PM",
    wednesday: "11:00 AM - 9:00 PM",
    thursday: "11:00 AM - 9:00 PM",
    friday: "11:00 AM - 10:00 PM",
    saturday: "10:00 AM - 10:00 PM",
    sunday: "10:00 AM - 8:00 PM"
  },
  popular: [
    "Classic Burger",
    "Margherita Pizza", 
    "Grilled Salmon",
    "Chocolate Lava Cake"
  ]
};

// Keywords and their responses
const keywordResponses = {
  'hours': `Our restaurant is open:\n
Monday: ${restaurantInfo.hours.monday}
Tuesday: ${restaurantInfo.hours.tuesday}
Wednesday: ${restaurantInfo.hours.wednesday}
Thursday: ${restaurantInfo.hours.thursday}
Friday: ${restaurantInfo.hours.friday}
Saturday: ${restaurantInfo.hours.saturday}
Sunday: ${restaurantInfo.hours.sunday}`,

  'location': `We're located at ${restaurantInfo.address}. You can find us in downtown Foodville, just two blocks from Central Park.`,
  
  'reservation': `You can make a reservation by:\n
1. Using our online reservation system on the Reservations page
2. Calling us at ${restaurantInfo.phone}
3. Emailing us at reservations@deliciousrestaurant.com

We recommend booking at least 2 days in advance for weekdays and 5 days for weekends.`,

  'menu': `Our menu features a variety of dishes including appetizers, salads, main courses, and desserts. Our most popular dishes are ${restaurantInfo.popular.join(', ')}. You can view our complete menu on the Menu page.`,
  
  'parking': `We offer complimentary valet parking for all dinner guests. There's also a public parking garage half a block away on Pine Street.`,
  
  'takeout': `Yes, we offer takeout! You can place an order by calling us at ${restaurantInfo.phone} or through our website. Pickup times are typically 20-30 minutes after ordering.`,
  
  'delivery': `We partner with several delivery services including DoorDash, Uber Eats, and GrubHub. Delivery times vary but typically range from 30-45 minutes.`,
  
  'chef': `Our executive chef is Maria Rodriguez, who brings over 15 years of culinary experience from top restaurants around the world. She specializes in fusion cuisine that blends Mediterranean and Asian influences.`,
  
  'vegetarian': `We offer several vegetarian options on our menu, including our popular Roasted Vegetable Risotto and Mushroom Wellington. Just let your server know about any dietary preferences or restrictions.`,
  
  'gluten': `We have several gluten-free options available. These items are clearly marked on our menu with a (GF) symbol. Our kitchen does handle gluten products, but we take precautions to avoid cross-contamination.`,
  
  'private': `We offer private dining options for special events. Our private room can accommodate up to 20 guests. For larger parties, we can arrange for semi-private areas in the main dining room.`,
  
  'alcohol': `We have a full bar with an extensive wine list, craft beers, and specialty cocktails. We also offer happy hour specials from 4-6 PM on weekdays.`,

  'gift': `Gift cards are available for purchase in-restaurant or online through our website. They make great gifts for any occasion!`
};

// Get fallback response based on message content
export function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Default response if no keywords match
  return `Thank you for your message! Our AI assistant is currently unavailable. 
  
For immediate assistance, please call us at ${restaurantInfo.phone} or email us at info@deliciousrestaurant.com.

You can also browse our website for information about our menu, hours, location, and reservation options.`;
}
