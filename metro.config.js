// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);
config.resolver.alias = {
  "@": path.resolve(__dirname), // <-- now "@/components/styles" → "<root>/components/styles"
};

module.exports = config;
