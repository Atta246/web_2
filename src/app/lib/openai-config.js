// This file contains configuration for the Azure OpenAI API integration

const config = {
  apiKey: '30e197aa12044759af38f955fe7f8df9', // Directly using the provided API key
  endpoint: 'https://api.azure.com/openai/deployments', // Update this with your actual Azure OpenAI endpoint
  deploymentName: 'gpt-35-turbo', // Update this with your actual deployment name
  apiVersion: '2023-05-15', // Azure OpenAI API version
  model: 'gpt-35-turbo', // Azure OpenAI model name
  temperature: 0.7,
  maxTokens: 500,
  systemPrompt: 'You are a helpful assistant for a restaurant. Provide information about the restaurant\'s menu, hours, location, reservation policies, and answer other restaurant-related questions. Be friendly, concise, and helpful.'
};

export default config;
