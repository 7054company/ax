const fs = require('fs');
const path = require('path');

const metricsDir = path.join(__dirname, '../.metrics');

if (!fs.existsSync(metricsDir)) {
    fs.mkdirSync(metricsDir);
}

function logPerformanceMetrics(command, dir, duration) {
    const metricsFile = path.join(metricsDir, 'performance.log');
    const logEntry = `${new Date().toISOString()} - Command: ${command} | Directory: ${dir} | Duration: ${duration}ms\n`;
    fs.appendFileSync(metricsFile, logEntry);
}

function logError(error) {
    const errorFile = path.join(metricsDir, 'errors.log');
    const logEntry = `${new Date().toISOString()} - Error: ${error.message}\n`;
    fs.appendFileSync(errorFile, logEntry);
}

module.exports = { logPerformanceMetrics, logError };
