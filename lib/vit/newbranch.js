const { 
    executeGitCommand, 
    getCurrentBranch, 
    isWorkingDirectoryClean 
} = require('./git.js');

const { isValidBranchName } = require('./validation.js');

const { 
    logInfo, 
    logSuccess, 
    logError 
} = require('./output.js');

/**
 * Execute vit newbranch command
 * @param {string[]} args - Command arguments
 */
function execute(args) {
    if (args.length === 0) {
        throw new Error('Branch name is required. Usage: vit newbranch feat/branch-name or vit newbranch fix/branch-name');
    }
    
    const branchName = args[0];
    
    logInfo('Checking current branch: develop');
    
    // Verify current branch is develop
    const currentBranch = getCurrentBranch();
    if (currentBranch !== 'develop') {
        throw new Error(`Must be on 'develop' branch. Current branch: ${currentBranch}`);
    }
    
    logInfo('Checking for uncommitted changes...');
    
    // Check for uncommitted changes
    if (!isWorkingDirectoryClean()) {
        throw new Error('Working directory has uncommitted changes. Please commit or stash changes first.');
    }
    
    logSuccess('Working directory clean');
    
    logInfo('Validating branch name format...');
    
    // Validate branch name format
    if (!isValidBranchName(branchName)) {
        throw new Error(`Invalid branch name: ${branchName}. Must start with 'feat/' or 'fix/'`);
    }
    
    logSuccess(`Branch name follows ${branchName.startsWith('feat/') ? 'feat/' : 'fix/'} convention`);
    
    // Create and switch to new branch
    executeGitCommand(`checkout -b ${branchName}`);
    
    logSuccess(`Created and switched to branch '${branchName}'`);
    logSuccess('Command completed successfully');
}

module.exports = {
    execute
}; 