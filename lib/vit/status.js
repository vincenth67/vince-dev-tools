const { 
    executeGitCommand, 
    getCurrentBranch,
    isBranchInSync
} = require('./git.js');

const { 
    getPackageJsonVersion, 
    getManifestJsonVersion,
    versionsMatch
} = require('./files.js');

const { 
    isFeatureOrFixBranch,
    isDevelopBranch,
    isMainBranch
} = require('./validation.js');

const { 
    logInfo, 
    logSuccess, 
    logWarning,
    logBranch
} = require('./output.js');

/**
 * Get workflow context for current branch
 * @param {string} branchName - Branch name
 * @returns {string} Workflow context description
 */
function getWorkflowContext(branchName) {
    if (isMainBranch(branchName)) {
        return 'production branch';
    } else if (isDevelopBranch(branchName)) {
        return 'integration branch';
    } else if (isFeatureOrFixBranch(branchName)) {
        return branchName.startsWith('feat/') ? 'feature branch' : 'fix branch';
    } else {
        return 'unknown branch type';
    }
}

/**
 * Get branch sync status description
 * @param {string} branchName - Branch name
 * @returns {string} Sync status description
 */
function getSyncStatus(branchName) {
    try {
        if (isBranchInSync(branchName)) {
            return 'in sync with remote';
        } else {
            // Get ahead/behind counts
            const status = executeGitCommand(`rev-list --left-right --count origin/${branchName}...${branchName}`, { silent: true });
            const [behind, ahead] = status.trim().split('\t').map(Number);
            
            if (behind > 0 && ahead > 0) {
                return `${ahead} commits ahead, ${behind} commits behind remote`;
            } else if (ahead > 0) {
                return `${ahead} commits ahead of remote`;
            } else if (behind > 0) {
                return `${behind} commits behind remote`;
            } else {
                return 'not in sync with remote';
            }
        }
    } catch (error) {
        return 'remote not available';
    }
}

/**
 * Execute vit status command
 * @param {string[]} args - Command arguments
 */
function execute(args) {
    // Get current branch
    const currentBranch = getCurrentBranch();
    const workflowContext = getWorkflowContext(currentBranch);
    
    logBranch(`Current branch: ${currentBranch} (${workflowContext})`);
    
    // Get version information
    const packageVersion = getPackageJsonVersion();
    const manifestVersion = getManifestJsonVersion();
    
    if (packageVersion) {
        logInfo(`Package version: ${packageVersion}`);
    }
    
    if (manifestVersion) {
        logInfo(`Manifest version: ${manifestVersion}`);
    }
    
    if (packageVersion && manifestVersion) {
        if (versionsMatch()) {
            logSuccess('Versions in sync');
        } else {
            logWarning('Versions out of sync');
        }
    }
    
    // Get branch sync status
    const syncStatus = getSyncStatus(currentBranch);
    logInfo(`Branch sync: ${syncStatus}`);
    
    // Show standard Git status
    console.log('\nGit status:');
    executeGitCommand('status');
    
    logSuccess('Status displayed successfully');
}

module.exports = {
    execute
}; 