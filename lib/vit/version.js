const { 
    executeGitCommand, 
    isWorkingDirectoryClean 
} = require('./git.js');

const { 
    calculateNewVersion, 
    isValidBumpType 
} = require('./validation.js');

const { 
    getPackageJsonVersion, 
    getManifestJsonVersion,
    updatePackageJsonVersion,
    updateManifestJsonVersion,
    bothJsonFilesExist,
    versionsMatch
} = require('./files.js');

const { 
    logInfo, 
    logSuccess, 
    logError 
} = require('./output.js');

/**
 * Execute vit version command
 * @param {string[]} args - Command arguments
 */
function execute(args) {
    if (args.length === 0) {
        throw new Error('Version bump type is required. Usage: vit version <patch|minor|major>');
    }
    
    const bumpType = args[0];
    
    // Validate bump type
    if (!isValidBumpType(bumpType)) {
        throw new Error(`Invalid bump type: ${bumpType}. Must be patch, minor, or major`);
    }
    
    // Check if both JSON files exist
    if (!bothJsonFilesExist()) {
        throw new Error('Both package.json and manifest.json must exist for version management');
    }
    
    // Check working directory is clean
    if (!isWorkingDirectoryClean()) {
        throw new Error('Working directory has uncommitted changes. Please commit or stash changes first.');
    }
    
    // Read current versions
    const packageVersion = getPackageJsonVersion();
    const manifestVersion = getManifestJsonVersion();
    
    logInfo(`Reading version from package.json: ${packageVersion}`);
    logInfo(`Reading version from manifest.json: ${manifestVersion}`);
    
    // Verify versions match
    if (!versionsMatch()) {
        throw new Error(`Version mismatch: package.json (${packageVersion}) != manifest.json (${manifestVersion})`);
    }
    
    logSuccess('Versions match in both files');
    
    // Calculate new version
    const newVersion = calculateNewVersion(packageVersion, bumpType);
    
    let resetInfo = '';
    if (bumpType === 'minor') {
        resetInfo = ' (patch reset to 0)';
    } else if (bumpType === 'major') {
        resetInfo = ' (minor and patch reset to 0)';
    }
    
    logInfo(`Bumping ${bumpType} version: ${packageVersion} → ${newVersion}${resetInfo}`);
    
    // Update both files
    updatePackageJsonVersion(newVersion);
    updateManifestJsonVersion(newVersion);
    
    logSuccess('Both files updated successfully');
    
    // Stage the files
    executeGitCommand('add package.json manifest.json');
    
    // Commit the changes
    executeGitCommand(`commit -m "chore: bump version to ${newVersion}"`);
    
    logSuccess(`Version bumped successfully to ${newVersion}`);
    logSuccess('Command completed successfully');
}

module.exports = {
    execute
}; 