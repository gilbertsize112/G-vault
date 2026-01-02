module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Environment variables will still work via process.env 
      // but we remove the extra plugin to test the Router
    ],
  };
};