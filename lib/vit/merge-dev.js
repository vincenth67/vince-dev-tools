const { 
    executeGitCommand, 
    getCurrentBranch, 
    isWorkingDirectoryClean,
    isBranchInSync
} = require('./git.js');

const { isFeatureOrFixBranch } = require('./validation.js');

const { 
    logInfo, 
    logSuccess, 
    logError 
} = require('./output.js');

/**
 * Execute vit merge-dev command
 * @param {string[]} args - Command arguments
 */
function execute(args) {
    // Get current branch
    const currentBranch = getCurrentBranch();
    logInfo(`Current branch: ${currentBranch}`);
    
    // Verify current branch is feat/ or fix/
    if (!isFeatureOrFixBranch(currentBranch)) {
        throw new Error(`Must be on feat/ or fix/ branch. Current branch: ${currentBranch}`);
    }
    
    logInfo(`Checking for uncommitted changes on ${currentBranch}...`);
    
    // Check current branch for uncommitted changes
    if (!isWorkingDirectoryClean()) {
        throw new Error(`Working directory has uncommitted changes on ${currentBranch}. Please commit or stash changes first.`);
    }
    
    logSuccess('Feature branch clean');
    
    // Switch to develop and check for uncommitted changes
    executeGitCommand('checkout develop');
    logInfo('Checking for uncommitted changes on develop...');
    
    if (!isWorkingDirectoryClean()) {
        // Switch back to original branch if develop is dirty
        executeGitCommand(`checkout ${currentBranch}`);
        throw new Error('Develop branch has uncommitted changes. Please commit or stash changes on develop first.');
    }
    
    logSuccess('Develop branch clean');
    
    // Switch back to original branch
    executeGitCommand(`checkout ${currentBranch}`);
    
    // Fetch remote updates
    executeGitCommand('fetch origin');
    
    // Check sync status for feature branch
    logInfo(`Checking if ${currentBranch} is in sync with remote...`);
    if (!isBranchInSync(currentBranch)) {
        throw new Error(`${currentBranch} is not in sync with remote. Please push or pull changes first.`);
    }
    logSuccess(`${currentBranch} branch in sync with remote`);
    
    // Check sync status for develop branch
    logInfo('Checking if develop is in sync with remote...');
    if (!isBranchInSync('develop')) {
        throw new Error('Develop branch is not in sync with remote. Please push or pull changes first.');
    }
    logSuccess('develop branch in sync with remote');
    
    // Switch to develop
    executeGitCommand('checkout develop');
    
    // Merge feature branch
    executeGitCommand(`merge ${currentBranch}`);
    
    // Push updated develop
    executeGitCommand('push origin develop');
    
    logSuccess(`Branch '${currentBranch}' merged into develop`);
    logSuccess('All feature commits preserved in develop history');
    logSuccess('Develop branch updated on remote');
    logInfo('Currently on develop branch');
    logSuccess('Command completed successfully');
}

module.exports = {
    execute
}; 