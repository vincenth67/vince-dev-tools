const { logError } = require('./vit/output.js');

// Import all command modules
const init = require('./vit/init.js');
const newbranch = require('./vit/newbranch.js');
const delbranch = require('./vit/delbranch.js');
const commit = require('./vit/commit.js');
const version = require('./vit/version.js');
const mergeDev = require('./vit/merge-dev.js');
const mergeMain = require('./vit/merge-main.js');
const status = require('./vit/status.js');

/**
 * Route command line arguments to appropriate command handler
 * @param {string[]} args - Command line arguments
 */
function routeCommand(args) {
    if (args.length === 0) {
        showHelp();
        return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    // Parse flags for specific commands
    if (command === 'init') {
        // Support: vit init -o <url> or --origin <url>
        let originUrl = null;
        let filteredArgs = [];
        for (let i = 0; i < commandArgs.length; i++) {
            if ((commandArgs[i] === '-o' || commandArgs[i] === '--origin') && commandArgs[i + 1]) {
                originUrl = commandArgs[i + 1];
                i++; // skip next
            } else {
                filteredArgs.push(commandArgs[i]);
            }
        }
        init.execute(filteredArgs, { originUrl });
        return;
    }
    if (command === 'merge-main') {
        // Support: vit merge-main -f or --force
        let force = false;
        let filteredArgs = [];
        for (let i = 0; i < commandArgs.length; i++) {
            if (commandArgs[i] === '-f' || commandArgs[i] === '--force') {
                force = true;
            } else {
                filteredArgs.push(commandArgs[i]);
            }
        }
        mergeMain.execute(filteredArgs, { force });
        return;
    }

    try {
        switch (command) {
            case 'init':
                init.execute(commandArgs);
                break;
            case 'newbranch':
                newbranch.execute(commandArgs);
                break;
            case 'delbranch':
                delbranch.execute(commandArgs);
                break;
            case 'commit':
                commit.execute(commandArgs);
                break;
            case 'version':
                version.execute(commandArgs);
                break;
            case 'merge-dev':
                mergeDev.execute(commandArgs);
                break;
            case 'merge-main':
                mergeMain.execute(commandArgs);
                break;
            case 'status':
                status.execute(commandArgs);
                break;
            case 'help':
            case '--help':
            case '-h':
                showHelp();
                break;
            default:
                logError(`Unknown command: ${command}`);
                showHelp();
                process.exit(1);
        }
    } catch (error) {
        logError(`Command failed: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Display help information
 */
function showHelp() {
    console.log(`
vince-dev-tools (vit) - Chrome Extension Development Workflow Tool

Usage: vit <command> [options]

Commands:
  init                    Initialize Git repository with Git Flow setup
  newbranch <name>        Create new feature/fix branch from develop
  delbranch [name]        Delete feature/fix branch (current or specified)
  commit <message>        Create conventional commit with auto-prefixing
  version <type>          Bump version (patch|minor|major) in both JSON files
  merge-dev               Merge current feature/fix branch into develop
  merge-main              Squash merge develop into main for release
  status                  Show enhanced status with workflow context
  help                    Show this help message

Examples:
  vit init
  vit newbranch feat/shopping-cart
  vit commit add new feature
  vit version minor
  vit merge-dev
  vit merge-main

For detailed information about each command, see the documentation.
`);
}

module.exports = {
    routeCommand
}; 