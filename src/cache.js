const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '../.cache');

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

function setCache(key, value) {
    fs.writeFileSync(path.join(cacheDir, key), JSON.stringify(value));
}

function getCache(key) {
    const filePath = path.join(cacheDir, key);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return null;
}

module.exports = { setCache, getCache };
