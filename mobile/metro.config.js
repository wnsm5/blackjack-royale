const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Inject polyfill.js into Metro's getPolyfills array BEFORE main bundle setup
const originalGetPolyfills = config.serializer.getPolyfills;
config.serializer.getPolyfills = (options) => {
  const original = originalGetPolyfills ? originalGetPolyfills(options) : [];
  return [path.resolve(__dirname, 'polyfill.js'), ...original];
};

module.exports = config;
