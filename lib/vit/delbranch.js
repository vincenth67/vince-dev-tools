const { 
    executeGitCommand, 
    getCurrentBranch, 
    isWorkingDirectoryClean,
    branchExists
} = require('./git.js');

const { isValidBranchName, isProtectedBranch } = require('./validation.js');

const { 
    logInfo, 
    logSuccess, 
    logError 
} = require('./output.js');

/**
 * Execute vit delbranch command
 * @param {string[]} args - Command arguments
 */
function execute(args) {
    let targetBranch;
    
    if (args.length === 0) {
        // Delete current branch
        targetBranch = getCurrentBranch();
        logInfo(`Target branch: ${targetBranch}`);
    } else {
        // Delete specified branch
        targetBranch = args[0];
        logInfo(`Target branch: ${targetBranch}`);
    }
    
    // Validate branch name
    if (!isValidBranchName(targetBranch)) {
        throw new Error(`Cannot delete branch '${targetBranch}'. Only feat/ and fix/ branches can be deleted.`);
    }
    
    // Check if branch exists
    if (!branchExists(targetBranch)) {
        throw new Error(`Branch '${targetBranch}' does not exist.`);
    }
    
    logInfo('Checking for uncommitted changes...');
    
    // Check for uncommitted changes
    if (!isWorkingDirectoryClean()) {
        throw new Error('Working directory has uncommitted changes. Please commit or stash changes first.');
    }
    
    logSuccess('Working directory clean');
    
    // If deleting current branch, switch to develop first
    const currentBranch = getCurrentBranch();
    if (currentBranch === targetBranch) {
        executeGitCommand('checkout develop');
    }
    
    // Delete branch locally
    executeGitCommand(`branch -d ${targetBranch}`);
    
    // Delete branch remotely (ignore errors if remote doesn't exist)
    try {
        executeGitCommand(`push origin --delete ${targetBranch}`);
    } catch (error) {
        // Remote branch might not exist, which is fine
        logInfo(`Remote branch '${targetBranch}' not found or already deleted`);
    }
    
    logSuccess(`Branch '${targetBranch}' deleted locally and remotely`);
    
    if (currentBranch === targetBranch) {
        logSuccess('Switched to develop branch');
    }
    
    logSuccess('Command completed successfully');
}

module.exports = {
    execute
}; 