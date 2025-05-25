// This Babel config is used only for Jest testing
module.exports = function(api) {
  // Cache based on NODE_ENV value
  api.cache.using(() => process.env.NODE_ENV);
  
  // Only apply this config in test environment
  const isTest = api.env('test');
  
  // Return different configs for different environments
  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' }}],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
    };
  }
  
  // Return empty config for non-test environments
  // This ensures Next.js will use SWC instead of Babel
  return {};
};
