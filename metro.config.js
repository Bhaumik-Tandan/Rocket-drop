const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable Watchman to fix FSEvents issues
config.watchFolders = [];
config.resolver.useWatchman = false;

module.exports = config; 