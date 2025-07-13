const { 
    executeGitCommand, 
    isGitRepository 
} = require('./git.js');

const { 
    updatePackageJsonVersion, 
    updateManifestJsonVersion,
    readPackageJson,
    readJsonFile
} = require('./files.js');

const { askYesNo, askText } = require('./prompt.js');

const { 
    logInfo, 
    logSuccess, 
    logWarning 
} = require('./output.js');

/**
 * Execute vit init command
 * @param {string[]} args - Command arguments
 */
async function execute(args) {
    logInfo('Checking if already in Git repository...');
    
    if (isGitRepository()) {
        throw new Error('Already in a Git repository. Aborting.');
    }
    
    logSuccess('No existing Git repository found');
    
    // Initialize Git repository
    executeGitCommand('init');
    
    // Rename master branch to main
    executeGitCommand('branch -m master main');
    
    // Update versions in JSON files
    const packageJson = readPackageJson();
    if (packageJson) {
        updatePackageJsonVersion('0.0.0');
    } else {
        logWarning('package.json not found');
    }
    
    const manifestJson = readJsonFile('manifest.json');
    if (manifestJson) {
        updateManifestJsonVersion('0.0.0');
    } else {
        logWarning('manifest.json not found');
    }
    
    // Stage all files
    executeGitCommand('add .');
    
    // Create initial commit
    executeGitCommand('commit -m "chore: initial commit"');
    
    // Create develop branch
    executeGitCommand('checkout -b develop');
    
    logSuccess('Project initialized with main/develop branches');
    logSuccess('Versions set to 0.0.0 in package.json and manifest.json');
    logSuccess('Currently on \'develop\' branch');
    
    // Prompt for remote origin setup
    const setupRemote = await askYesNo('Do you want to set up a remote origin?');
    
    if (setupRemote) {
        const remoteUrl = await askText('Enter GitHub repository URL');
        
        if (remoteUrl) {
            executeGitCommand(`remote add origin ${remoteUrl}`);
            executeGitCommand('push -u origin main');
            executeGitCommand('push -u origin develop');
            logSuccess('Pushed both branches to remote');
        }
    }
    
    logSuccess('Command completed successfully');
}

module.exports = {
    execute
}; 