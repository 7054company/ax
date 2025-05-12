const fs = require('fs');
const path = require('path');

// Define cache directory for storing cached files
const cacheDir = path.join(__dirname, '../.cache');

// Create the cache directory if it doesn't exist
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

// Function to save cache data as JSON in a specified file
function setCache(key, value) {
    const filePath = path.join(cacheDir, key);
    try {
        fs.writeFileSync(filePath, JSON.stringify(value, null, 2)); // Formatting JSON for readability
    } catch (error) {
        console.error(`Failed to set cache for ${key}:`, error);
    }
}

// Function to retrieve cached data if it exists
function getCache(key) {
    const filePath = path.join(cacheDir, key);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (error) {
        console.error(`Failed to get cache for ${key}:`, error);
    }
    return null;
}

module.exports = { setCache, getCache };
