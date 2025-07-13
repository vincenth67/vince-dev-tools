const { 
    executeGitCommand, 
    getCurrentBranch, 
    isWorkingDirectoryClean,
    isBranchInSync
} = require('./git.js');

const { isDevelopBranch } = require('./validation.js');

const { 
    getPackageJsonVersion 
} = require('./files.js');

const { askYesNo } = require('./prompt.js');

const { 
    logInfo, 
    logSuccess, 
    logError 
} = require('./output.js');

/**
 * Handle merge conflicts with interactive prompt
 * @returns {Promise<boolean>} True if merge should continue, false to abort
 */
async function handleMergeConflicts() {
    console.log('\nMerge conflicts detected!');
    const useDevelopVersion = await askYesNo('Do you want to force merge using develop\'s version? (This will overwrite main\'s version)');
    
    if (useDevelopVersion) {
        // Reset to develop's version for all conflicted files
        executeGitCommand('reset --hard HEAD');
        executeGitCommand('add .');
        return true;
    } else {
        // Abort the merge
        executeGitCommand('merge --abort');
        return false;
    }
}

/**
 * Execute vit merge-main command
 * @param {string[]} args - Command arguments
 */
async function execute(args) {
    // Get current branch
    const currentBranch = getCurrentBranch();
    logInfo(`Current branch: ${currentBranch}`);
    
    // Verify current branch is develop
    if (!isDevelopBranch(currentBranch)) {
        throw new Error(`Must be on develop branch. Current branch: ${currentBranch}`);
    }
    
    logInfo('Checking for uncommitted changes on develop...');
    
    // Check develop for uncommitted changes
    if (!isWorkingDirectoryClean()) {
        throw new Error('Develop branch has uncommitted changes. Please commit or stash changes first.');
    }
    
    logSuccess('develop branch clean');
    
    // Switch to main and check for uncommitted changes
    executeGitCommand('checkout main');
    logInfo('Checking for uncommitted changes on main...');
    
    if (!isWorkingDirectoryClean()) {
        // Switch back to develop if main is dirty
        executeGitCommand('checkout develop');
        throw new Error('Main branch has uncommitted changes. Please commit or stash changes on main first.');
    }
    
    logSuccess('main branch clean');
    
    // Fetch remote updates
    executeGitCommand('fetch origin');
    
    // Check sync status for main branch
    logInfo('Checking if main is in sync with remote...');
    if (!isBranchInSync('main')) {
        executeGitCommand('checkout develop');
        throw new Error('Main branch is not in sync with remote. Please push or pull changes first.');
    }
    logSuccess('main branch in sync with remote');
    
    // Switch back to develop and check sync status
    executeGitCommand('checkout develop');
    logInfo('Checking if develop is in sync with remote...');
    if (!isBranchInSync('develop')) {
        throw new Error('Develop branch is not in sync with remote. Please push or pull changes first.');
    }
    logSuccess('develop branch in sync with remote');
    
    // Switch to main
    executeGitCommand('checkout main');
    
    // Squash merge develop
    try {
        executeGitCommand('merge develop --squash');
        logSuccess('develop squashed into main successfully');
    } catch (error) {
        // Handle merge conflicts
        const shouldContinue = await handleMergeConflicts();
        if (!shouldContinue) {
            logInfo('Merge aborted. Please resolve conflicts manually and try again.');
            return;
        }
    }
    
    // Get current version for commit message and tag
    const currentVersion = getPackageJsonVersion();
    if (!currentVersion) {
        throw new Error('Could not read version from package.json');
    }
    
    logInfo(`Reading version from package.json: ${currentVersion}`);
    
    // Create explicit commit
    executeGitCommand(`commit -m "release: merge develop into main for v${currentVersion}"`);
    
    // Create annotated tag
    executeGitCommand(`tag -a v${currentVersion} -m "Release version ${currentVersion}"`);
    
    // Push main branch and tag
    executeGitCommand('push origin main');
    executeGitCommand(`push origin v${currentVersion}`);
    
    logSuccess(`Release v${currentVersion} squashed and published to main`);
    logSuccess(`Tag v${currentVersion} created and pushed`);
    logInfo('Currently on main branch');
    logSuccess('Command completed successfully');
}

module.exports = {
    execute
}; 