const {
    executeGitCommand,
    isGitRepository,
    isGitUserNameConfigured,
    isGitUserEmailConfigured,
    setGitUserName,
    setGitUserEmail
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

    // Check Git user identity
    logInfo('Checking Git user identity...');
    let needUserName = !isGitUserNameConfigured();
    let needUserEmail = !isGitUserEmailConfigured();
    let userName, userEmail;
    if (needUserName) {
        userName = await askText('Enter your name for Git commits');
        setGitUserName(userName);
        logInfo(`Set Git user.name to "${userName}"`);
    }
    if (needUserEmail) {
        userEmail = await askText('Enter your email for Git commits');
        setGitUserEmail(userEmail);
        logInfo(`Set Git user.email to "${userEmail}"`);
    }
    if (!needUserName && !needUserEmail) {
        logSuccess('Git identity configured');
    } else {
        logSuccess('Git identity configured');
    }

    // Update versions in JSON files
    const packageJson = readPackageJson();
    if (packageJson) {
        logInfo('Found package.json, updating version to 0.0.0');
        updatePackageJsonVersion('0.0.0');
    } else {
        logWarning('package.json not found');
    }

    const manifestJson = readJsonFile('manifest.json');
    if (manifestJson) {
        logInfo('Found manifest.json, updating version to 0.0.0');
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