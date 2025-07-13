const { 
    executeGitCommand, 
    getCurrentBranch, 
    isWorkingDirectoryClean 
} = require('./git.js');

const { 
    isValidCommitType, 
    getCommitTypeFromBranch 
} = require('./validation.js');

const { 
    logInfo, 
    logSuccess, 
    logError 
} = require('./output.js');

/**
 * Parse command line arguments for commit flags
 * @param {string[]} args - Command arguments
 * @returns {Object} Parsed options
 */
function parseCommitArgs(args) {
    const options = {
        type: null,
        scope: null,
        message: ''
    };
    
    let i = 0;
    while (i < args.length) {
        const arg = args[i];
        
        if (arg === '-t' && i + 1 < args.length) {
            options.type = args[i + 1];
            i += 2;
        } else if (arg === '-s' && i + 1 < args.length) {
            options.scope = args[i + 1];
            i += 2;
        } else {
            // Everything else is part of the message
            options.message = args.slice(i).join(' ');
            break;
        }
    }
    
    return options;
}

/**
 * Build conventional commit message
 * @param {string} type - Commit type
 * @param {string|null} scope - Commit scope
 * @param {string} message - Commit message
 * @returns {string} Formatted commit message
 */
function buildCommitMessage(type, scope, message) {
    if (!message || message.trim() === '') {
        throw new Error('Commit message is required');
    }
    
    let commitMessage = type;
    
    if (scope) {
        commitMessage += `(${scope})`;
    }
    
    commitMessage += `: ${message.trim()}`;
    
    return commitMessage;
}

/**
 * Execute vit commit command
 * @param {string[]} args - Command arguments
 */
function execute(args) {
    if (args.length === 0) {
        throw new Error('Commit message is required. Usage: vit commit <message> or vit commit -t <type> -s <scope> <message>');
    }
    
    // Parse arguments
    const options = parseCommitArgs(args);
    
    // Get current branch
    const currentBranch = getCurrentBranch();
    logInfo(`Current branch: ${currentBranch}`);
    
    // Determine commit type
    let commitType = options.type;
    if (!commitType) {
        commitType = getCommitTypeFromBranch(currentBranch);
        if (!commitType) {
            throw new Error('Must be on feat/ or fix/ branch, or specify type with -t flag');
        }
        logInfo(`Auto-detected type: ${commitType}`);
    } else {
        logInfo(`Explicit type: ${commitType}`);
        
        // Validate explicit type
        if (!isValidCommitType(commitType)) {
            throw new Error(`Invalid commit type: ${commitType}. Valid types: feat, fix, chore, docs, refactor, style`);
        }
    }
    
    // Log scope if provided
    if (options.scope) {
        logInfo(`Scope: ${options.scope}`);
    }
    
    // Build commit message
    const commitMessage = buildCommitMessage(commitType, options.scope, options.message);
    logInfo(`Message: "${commitMessage}"`);
    
    // Check for staged changes
    const status = executeGitCommand('status --porcelain', { silent: true });
    const hasStagedChanges = status.split('\n').some(line => line.startsWith('A ') || line.startsWith('M ') || line.startsWith('D '));
    
    if (!hasStagedChanges) {
        throw new Error('No staged changes found. Please stage changes with git add before committing.');
    }
    
    // Execute commit
    executeGitCommand(`commit -m "${commitMessage}"`);
    
    logSuccess('Changes committed successfully');
    logSuccess('Command completed successfully');
}

module.exports = {
    execute
}; 