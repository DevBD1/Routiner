// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add support for importing from the app directory
config.resolver.alias = {
  "@": path.resolve(__dirname), // <-- now "@/components/styles" → "<root>/components/styles"
};

// Add support for importing from the app directory
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

// Add support for importing from the app directory
config.watchFolders = [path.resolve(__dirname, 'app')];

module.exports = config;
