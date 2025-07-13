const readline = require('readline');

/**
 * Create a simple y/n prompt
 * @param {string} question - Question to ask
 * @returns {Promise<boolean>} True for yes, false for no
 */
function askYesNo(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question(`${question} (y/n): `, (answer) => {
            rl.close();
            const normalized = answer.toLowerCase().trim();
            resolve(normalized === 'y' || normalized === 'yes');
        });
    });
}

/**
 * Create a text input prompt
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User input
 */
function askText(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question(`${question}: `, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

module.exports = {
    askYesNo,
    askText
}; 