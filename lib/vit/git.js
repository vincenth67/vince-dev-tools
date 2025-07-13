const { execSync } = require('child_process');
const { logCommand, logError } = require('./output.js');

/**
 * Execute a Git command and return the output
 * @param {string} command - Git command to execute
 * @param {Object} options - Execution options
 * @returns {string} Command output
 */
function executeGitCommand(command, options = {}) {
    const { silent = false, cwd = process.cwd() } = options;
    
    if (!silent) {
        logCommand(`git ${command}`);
    }
    
    try {
        const output = execSync(`git ${command}`, {
            cwd,
            encoding: 'utf8',
            stdio: silent ? 'pipe' : 'inherit'
        });
        return output;
    } catch (error) {
        // Display the raw Git error output
        if (error.stdout) {
            console.log(error.stdout);
        }
        if (error.stderr) {
            console.error(error.stderr);
        }
        throw new Error(`Git command failed: git ${command}`);
    }
}

/**
 * Execute a Git command silently (no output shown)
 * @param {string} command - Git command to execute
 * @param {Object} options - Execution options
 * @returns {string} Command output
 */
function executeGitCommandSilent(command, options = {}) {
    return executeGitCommand(command, { ...options, silent: true });
}

/**
 * Check if current directory is a Git repository
 * @returns {boolean} True if Git repository exists
 */
function isGitRepository() {
    try {
        executeGitCommandSilent('rev-parse --git-dir');
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get current branch name
 * @returns {string} Current branch name
 */
function getCurrentBranch() {
    try {
        return executeGitCommandSilent('rev-parse --abbrev-ref HEAD').trim();
    } catch (error) {
        throw new Error('Could not determine current branch');
    }
}

/**
 * Check if working directory is clean (no uncommitted changes)
 * @returns {boolean} True if working directory is clean
 */
function isWorkingDirectoryClean() {
    try {
        const status = executeGitCommandSilent('status --porcelain');
        return status.trim() === '';
    } catch (error) {
        throw new Error('Could not check working directory status');
    }
}

/**
 * Check if branch exists
 * @param {string} branchName - Branch name to check
 * @returns {boolean} True if branch exists
 */
function branchExists(branchName) {
    try {
        executeGitCommandSilent(`show-ref --verify --quiet refs/heads/${branchName}`);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Check if branch is in sync with remote
 * @param {string} branchName - Branch name to check
 * @returns {boolean} True if branch is in sync
 */
function isBranchInSync(branchName) {
    try {
        // Fetch latest changes
        executeGitCommandSilent('fetch origin');
        
        // Check if local branch is behind or ahead of remote
        const status = executeGitCommandSilent(`rev-list --left-right --count origin/${branchName}...${branchName}`);
        const [behind, ahead] = status.trim().split('\t').map(Number);
        
        return behind === 0 && ahead === 0;
    } catch (error) {
        // If remote branch doesn't exist, consider it in sync
        return true;
    }
}

/**
 * Get remote URL for origin
 * @returns {string|null} Remote URL or null if not set
 */
function getRemoteOrigin() {
    try {
        return executeGitCommandSilent('config --get remote.origin.url').trim();
    } catch (error) {
        return null;
    }
}

module.exports = {
    executeGitCommand,
    executeGitCommandSilent,
    isGitRepository,
    getCurrentBranch,
    isWorkingDirectoryClean,
    branchExists,
    isBranchInSync,
    getRemoteOrigin
}; 