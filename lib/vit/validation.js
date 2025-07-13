const { logError } = require('./output.js');

/**
 * Valid conventional commit types
 */
const VALID_COMMIT_TYPES = ['feat', 'fix', 'chore', 'docs', 'refactor', 'style'];

/**
 * Validate branch name format (must start with feat/ or fix/)
 * @param {string} branchName - Branch name to validate
 * @returns {boolean} True if valid format
 */
function isValidBranchName(branchName) {
    if (!branchName || typeof branchName !== 'string') {
        return false;
    }
    
    return branchName.startsWith('feat/') || branchName.startsWith('fix/');
}

/**
 * Validate commit type
 * @param {string} type - Commit type to validate
 * @returns {boolean} True if valid type
 */
function isValidCommitType(type) {
    return VALID_COMMIT_TYPES.includes(type);
}

/**
 * Validate semantic version string
 * @param {string} version - Version string to validate
 * @returns {boolean} True if valid semantic version
 */
function isValidSemanticVersion(version) {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
}

/**
 * Validate version bump type
 * @param {string} bumpType - Bump type to validate
 * @returns {boolean} True if valid bump type
 */
function isValidBumpType(bumpType) {
    return ['patch', 'minor', 'major'].includes(bumpType);
}

/**
 * Calculate new version based on current version and bump type
 * @param {string} currentVersion - Current semantic version
 * @param {string} bumpType - Type of bump (patch, minor, major)
 * @returns {string} New version string
 */
function calculateNewVersion(currentVersion, bumpType) {
    if (!isValidSemanticVersion(currentVersion)) {
        throw new Error(`Invalid current version: ${currentVersion}`);
    }
    
    if (!isValidBumpType(bumpType)) {
        throw new Error(`Invalid bump type: ${bumpType}`);
    }
    
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (bumpType) {
        case 'patch':
            return `${major}.${minor}.${patch + 1}`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'major':
            return `${major + 1}.0.0`;
        default:
            throw new Error(`Unknown bump type: ${bumpType}`);
    }
}

/**
 * Extract commit type from branch name
 * @param {string} branchName - Branch name
 * @returns {string|null} Commit type or null if not a feature/fix branch
 */
function getCommitTypeFromBranch(branchName) {
    if (branchName.startsWith('feat/')) {
        return 'feat';
    } else if (branchName.startsWith('fix/')) {
        return 'fix';
    }
    return null;
}

/**
 * Validate that current branch is a feature or fix branch
 * @param {string} branchName - Branch name to validate
 * @returns {boolean} True if valid feature/fix branch
 */
function isFeatureOrFixBranch(branchName) {
    return isValidBranchName(branchName);
}

/**
 * Validate that current branch is develop
 * @param {string} branchName - Branch name to validate
 * @returns {boolean} True if develop branch
 */
function isDevelopBranch(branchName) {
    return branchName === 'develop';
}

/**
 * Validate that current branch is main
 * @param {string} branchName - Branch name to validate
 * @returns {boolean} True if main branch
 */
function isMainBranch(branchName) {
    return branchName === 'main';
}

/**
 * Check if branch is protected (main or develop)
 * @param {string} branchName - Branch name to check
 * @returns {boolean} True if protected branch
 */
function isProtectedBranch(branchName) {
    return isMainBranch(branchName) || isDevelopBranch(branchName);
}

module.exports = {
    isValidBranchName,
    isValidCommitType,
    isValidSemanticVersion,
    isValidBumpType,
    calculateNewVersion,
    getCommitTypeFromBranch,
    isFeatureOrFixBranch,
    isDevelopBranch,
    isMainBranch,
    isProtectedBranch,
    VALID_COMMIT_TYPES
}; 