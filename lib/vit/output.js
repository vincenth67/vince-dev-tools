/**
 * Output utilities for colored console output and formatting
 */

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

/**
 * Log a message with green color (success)
 * @param {string} message - Message to log
 */
function logSuccess(message) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
}

/**
 * Log a message with red color (error)
 * @param {string} message - Message to log
 */
function logError(message) {
    console.error(`${colors.red}✗${colors.reset} ${message}`);
}

/**
 * Log a message with yellow color (warning)
 * @param {string} message - Message to log
 */
function logWarning(message) {
    console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

/**
 * Log a message with blue color (info)
 * @param {string} message - Message to log
 */
function logInfo(message) {
    console.log(`${colors.blue}→${colors.reset} ${message}`);
}

/**
 * Log a message with cyan color (command execution)
 * @param {string} message - Message to log
 */
function logCommand(message) {
    console.log(`${colors.cyan}→${colors.reset} Running: ${message}`);
}

/**
 * Log a message with magenta color (branch info)
 * @param {string} message - Message to log
 */
function logBranch(message) {
    console.log(`${colors.magenta}→${colors.reset} ${message}`);
}

/**
 * Log a message with bright formatting (section headers)
 * @param {string} message - Message to log
 */
function logSection(message) {
    console.log(`\n${colors.bright}${message}${colors.reset}`);
}

module.exports = {
    logSuccess,
    logError,
    logWarning,
    logInfo,
    logCommand,
    logBranch,
    logSection
}; 