const fs = require('fs');
const path = require('path');
const { logInfo } = require('./output.js');

/**
 * Read and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Object|null} Parsed JSON object or null if file doesn't exist
 */
function readJsonFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
    }
}

/**
 * Write a JSON object to a file
 * @param {string} filePath - Path to the JSON file
 * @param {Object} data - JSON object to write
 */
function writeJsonFile(filePath, data) {
    try {
        const content = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
        throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
    }
}

/**
 * Read package.json file
 * @returns {Object|null} Package.json content or null if file doesn't exist
 */
function readPackageJson() {
    return readJsonFile('package.json');
}

/**
 * Read manifest.json file
 * @returns {Object|null} Manifest.json content or null if file doesn't exist
 */
function readManifestJson() {
    return readJsonFile('manifest.json');
}

/**
 * Update version in package.json
 * @param {string} version - New version string
 */
function updatePackageJsonVersion(version) {
    const packageJson = readPackageJson();
    if (!packageJson) {
        throw new Error('package.json file not found');
    }
    
    packageJson.version = version;
    writeJsonFile('package.json', packageJson);
    logInfo(`Writing version ${version} to package.json`);
}

/**
 * Update version in manifest.json
 * @param {string} version - New version string
 */
function updateManifestJsonVersion(version) {
    const manifestJson = readJsonFile('manifest.json');
    if (!manifestJson) {
        throw new Error('manifest.json file not found');
    }
    
    manifestJson.version = version;
    writeJsonFile('manifest.json', manifestJson);
    logInfo(`Writing version ${version} to manifest.json`);
}

/**
 * Get version from package.json
 * @returns {string|null} Version string or null if file doesn't exist
 */
function getPackageJsonVersion() {
    const packageJson = readPackageJson();
    return packageJson ? packageJson.version : null;
}

/**
 * Get version from manifest.json
 * @returns {string|null} Version string or null if file doesn't exist
 */
function getManifestJsonVersion() {
    const manifestJson = readJsonFile('manifest.json');
    return manifestJson ? manifestJson.version : null;
}

/**
 * Check if both package.json and manifest.json exist
 * @returns {boolean} True if both files exist
 */
function bothJsonFilesExist() {
    return fs.existsSync('package.json') && fs.existsSync('manifest.json');
}

/**
 * Check if versions match between package.json and manifest.json
 * @returns {boolean} True if versions match
 */
function versionsMatch() {
    const packageVersion = getPackageJsonVersion();
    const manifestVersion = getManifestJsonVersion();
    
    if (!packageVersion || !manifestVersion) {
        return false;
    }
    
    return packageVersion === manifestVersion;
}

module.exports = {
    readJsonFile,
    writeJsonFile,
    readPackageJson,
    readManifestJson,
    updatePackageJsonVersion,
    updateManifestJsonVersion,
    getPackageJsonVersion,
    getManifestJsonVersion,
    bothJsonFilesExist,
    versionsMatch
}; 