# vince-dev-tools Development Blueprint

## 1. Executive Summary

vince-dev-tools is a personal developer productivity toolkit designed to standardize and streamline common development workflows for Chrome extension projects. The toolkit provides a command-line interface called `vit` that abstracts away common Git operations, enforces conventional commits, and automates version management across multiple files.

### 1.1 Core Objectives

- **Standardization**: Enforce consistent Git Flow branching model and conventional commit practices
- **Automation**: Automate repetitive Git operations and version management
- **Productivity**: Reduce setup time and minimize errors across projects
- **Modularity**: Provide extensible foundation for future developer utilities

### 1.2 Key Features

- Smart Git repository initialization with proper branching setup
- Automated branch management following Git Flow principles
- Conventional commit enforcement with smart prefixing
- Synchronized version management for package.json and manifest.json
- Transparent Git operation execution with verbose output
- Interactive conflict resolution for merge operations

### 1.3 Target Audience

Solo developer (Vincent) working on Chrome extension projects, requiring consistent development practices across multiple repositories.

## 2. Technical Architecture

### 2.1 Technology Stack

- **Language**: JavaScript (Node.js)
- **Distribution**: NPM package from private GitHub repository
- **Installation**: Project-specific via `npm install`
- **Execution**: Command-line interface through `npx` or global installation

### 2.2 Project Structure

```
vince-dev-tools/
├── .git/                      # Git repository
├── .gitignore                 # Git ignore file (includes node_modules/)
├── package.json               # NPM configuration and dependencies
├── node_modules/              # NPM dependencies (git ignored)
├── bin/
│   └── vit.js                 # Main entry point and command router
├── lib/
│   ├── vit/                   # Core vit functionality
│   │   ├── init.js            # vit init command implementation
│   │   ├── newbranch.js       # vit newbranch command implementation
│   │   ├── delbranch.js       # vit delbranch command implementation
│   │   ├── commit.js          # vit commit command implementation
│   │   ├── version.js         # vit version command implementation
│   │   ├── merge-dev.js       # vit merge-dev command implementation
│   │   ├── merge-main.js      # vit merge-main command implementation
│   │   ├── status.js          # vit status command implementation
│   │   ├── git.js             # Git command execution utilities
│   │   ├── files.js           # File reading/writing operations
│   │   ├── validation.js      # Input validation and branch name checking
│   │   └── output.js          # Colored output and formatting utilities
│   └── index.js               # Main exports and command routing
├── doc/
│   └── blueprint.md           # This development blueprint document
└── README.md                  # Project description and quick reference
```

### 2.3 Development Environment Setup

#### 2.3.1 Folder Organization

Two separate directories are required for development:

```
/development-workspace/
├── vince-dev-tools/           # Tool development repository
│   ├── .git/                  # Tool's Git repository
│   ├── lib/vit/               # Tool implementation
│   └── [project files]
└── vince-dev-tools_testing/      # Testing environment
    ├── .git/                  # Separate Git repository for testing
    ├── package.json           # Test project configuration
    ├── manifest.json          # Test Chrome extension manifest
    └── node_modules/
        └── vince-dev-tools/   # Tool installed here for testing
```

IMPORTANT: 
You AI will be just developing what is in "vince-dev-tools/", that is your task and project.  
"vince-dev-tools_testing/" is a separate project developed externally, used to test the correctness of all the vit command you will create.
   
  #### 2.3.2 Development Workflow

1. **Tool Development**: Work in `vince-dev-tools/` using standard Git commands
2. **Tool Testing**: Install tool in `vince-dev-tools_testing/` using `npm install ../vince-dev-tools`
3. **Command Testing**: Execute `vit` commands in `vince-dev-tools_testing/`
4. **Iteration**: Update tool code, reinstall, and retest

## 3. Command Specifications

### 3.1 vit init

#### 3.1.1 Purpose
Initialize a new project with Git Flow branching model and version setup.

#### 3.1.2 Prerequisites
- Not currently in a Git repository
- Optional: package.json and/or manifest.json files present

#### 3.1.3 Command Flow
1. Check if already in Git repository (abort if true)
2. Execute `git init`
3. Rename master branch to main: `git branch -m master main`
4. Update package.json version to "0.0.0" (if file exists, warn if not)
5. Update manifest.json version to "0.0.0" (if file exists, warn if not)
6. Stage all files: `git add .`
7. Create initial commit: `git commit -m "chore: initial commit"`
8. Create develop branch: `git checkout -b develop`
9. Prompt for remote origin setup
10. If remote requested, add origin and push both branches

#### 3.1.4 Example Output
```bash
$ vit init
→ Checking if already in Git repository...
✓ No existing Git repository found
→ Running: git init
→ Running: git branch -m master main
→ Found package.json, updating version to 0.0.0
→ Found manifest.json, updating version to 0.0.0
→ Running: git add .
→ Running: git commit -m "chore: initial commit"
→ Running: git checkout -b develop
✓ Project initialized with main/develop branches
✓ Versions set to 0.0.0 in package.json and manifest.json
✓ Currently on 'develop' branch
? Do you want to set up a remote origin? (y/n): y
? Enter GitHub repository URL: https://github.com/username/repo.git
→ Running: git remote add origin https://github.com/username/repo.git
→ Running: git push -u origin main
→ Running: git push -u origin develop
✓ Pushed both branches to remote
✓ Command completed successfully
```

### 3.2 vit newbranch

#### 3.2.1 Purpose
Create and switch to a new feature or fix branch from develop.

#### 3.2.2 Command Format
- `vit newbranch feat/feature-name`
- `vit newbranch fix/fix-name`

#### 3.2.3 Prerequisites
- Must be on `develop` branch
- Working directory must be clean
- Branch name must follow feat/ or fix/ convention

#### 3.2.4 Command Flow
1. Verify current branch is `develop`
2. Check for uncommitted changes
3. Validate branch name format (feat/ or fix/ prefix)
4. Create and switch to new branch: `git checkout -b [branch-name]`

#### 3.2.5 Example Output
```bash
$ vit newbranch feat/shopping-cart
→ Checking current branch: develop
→ Checking for uncommitted changes...
✓ Working directory clean
→ Validating branch name format...
✓ Branch name follows feat/ convention
→ Running: git checkout -b feat/shopping-cart
✓ Created and switched to branch 'feat/shopping-cart'
✓ Command completed successfully
```

### 3.3 vit delbranch

#### 3.3.1 Purpose
Safely delete feature or fix branches with proper validation.

#### 3.3.2 Command Format
- `vit delbranch` - Delete current branch
- `vit delbranch feat/branch-name` - Delete specific branch

#### 3.3.3 Prerequisites
- Cannot delete `main` or `develop` branches
- Target branch must be feat/ or fix/ branch
- Working directory must be clean

#### 3.3.4 Command Flow
1. Determine target branch (current or specified)
2. Validate branch name (must be feat/ or fix/)
3. Check for uncommitted changes
4. Switch to `develop` if deleting current branch
5. Delete branch locally: `git branch -d [branch-name]`
6. Delete branch remotely: `git push origin --delete [branch-name]`

#### 3.3.5 Example Output
```bash
$ vit delbranch feat/shopping-cart
→ Target branch: feat/shopping-cart
→ Checking for uncommitted changes...
✓ Working directory clean
→ Running: git checkout develop
→ Running: git branch -d feat/shopping-cart
→ Running: git push origin --delete feat/shopping-cart
✓ Branch 'feat/shopping-cart' deleted locally and remotely
✓ Switched to develop branch
✓ Command completed successfully
```

### 3.4 vit commit

#### 3.4.1 Purpose
Smart commit with conventional commit formatting and type/scope support.

#### 3.4.2 Command Format
- `vit commit message text` - Auto-prefix from branch
- `vit commit -t type message text` - Explicit type
- `vit commit -s scope message text` - Auto-prefix + scope
- `vit commit -t type -s scope message text` - Explicit type + scope

#### 3.4.3 Supported Types
`feat`, `fix`, `chore`, `docs`, `refactor`, `style`

#### 3.4.4 Prerequisites
- Must be on feat/ or fix/ branch (not main/develop)
- Must have staged changes

#### 3.4.5 Command Flow
1. Parse command flags (-t for type, -s for scope)
2. Validate type against allowed list (if provided)
3. Determine commit type: explicit (-t) or auto-detect from branch
4. Build conventional commit message
5. Execute commit: `git commit -m "[formatted message]"`

#### 3.4.6 Example Commands and Output
```bash
$ vit commit add new feature
→ Current branch: feat/shopping-cart
→ Auto-detected type: feat
→ Message: "feat: add new feature"
→ Running: git commit -m "feat: add new feature"
✓ Changes committed successfully
✓ Command completed successfully

$ vit commit -t chore -s build update webpack
→ Current branch: feat/shopping-cart
→ Explicit type: chore
→ Scope: build
→ Message: "chore(build): update webpack"
→ Running: git commit -m "chore(build): update webpack"
✓ Changes committed successfully
✓ Command completed successfully
```

### 3.5 vit version

#### 3.5.1 Purpose
Bump version numbers in both package.json and manifest.json following semantic versioning.

#### 3.5.2 Command Format
- `vit version patch` - Bug fixes (increment Z: 1.2.3 → 1.2.4)
- `vit version minor` - New features (increment Y, reset Z: 1.2.3 → 1.3.0)
- `vit version major` - Breaking changes (increment X, reset Y,Z: 1.2.3 → 2.0.0)

#### 3.5.3 Prerequisites
- Working directory must be clean
- Both package.json and manifest.json must exist
- Versions in both files must match

#### 3.5.4 Command Flow
1. Read current version from package.json
2. Read current version from manifest.json
3. Verify versions match between files
4. Calculate new version based on bump type and reset rules
5. Update both files with new version
6. Stage both files: `git add package.json manifest.json`
7. Commit changes: `git commit -m "chore: bump version to [new-version]"`

#### 3.5.5 Example Output
```bash
$ vit version minor
→ Reading version from package.json: 1.98.5
→ Reading version from manifest.json: 1.98.5
✓ Versions match in both files
→ Bumping minor version: 1.98.5 → 1.99.0 (patch reset to 0)
→ Writing version 1.99.0 to package.json
→ Writing version 1.99.0 to manifest.json
✓ Both files updated successfully
→ Running: git add package.json manifest.json
→ Running: git commit -m "chore: bump version to 1.99.0"
✓ Version bumped successfully to 1.99.0
✓ Command completed successfully
```

### 3.6 vit merge-dev

#### 3.6.1 Purpose
Merge current feature/fix branch into develop branch (normal merge, preserve history).

#### 3.6.2 Prerequisites
- Must be on feat/ or fix/ branch
- Current branch must be clean
- Develop branch must be clean
- Both branches must be in sync with remote

#### 3.6.3 Command Flow
1. Verify current branch is feat/ or fix/
2. Check current branch for uncommitted changes
3. Switch to develop and check for uncommitted changes
4. Switch back to original branch if develop is dirty (abort)
5. Fetch remote updates
6. Check sync status for both branches
7. Switch to develop
8. Merge feature/fix branch: `git merge [branch-name]`
9. Push updated develop: `git push origin develop`
10. Stay on develop branch

#### 3.6.4 Example Output
```bash
$ vit merge-dev
→ Current branch: feat/shopping-cart
→ Checking for uncommitted changes on feat/shopping-cart...
✓ Feature branch clean
→ Running: git checkout develop
→ Checking for uncommitted changes on develop...
✓ Develop branch clean
→ Running: git checkout feat/shopping-cart
→ Running: git fetch origin
→ Checking if feat/shopping-cart is in sync with remote...
✓ feat/shopping-cart branch in sync with remote
→ Checking if develop is in sync with remote...
✓ develop branch in sync with remote
→ Running: git checkout develop
→ Running: git merge feat/shopping-cart
→ Running: git push origin develop
✓ Branch 'feat/shopping-cart' merged into develop
✓ All feature commits preserved in develop history
✓ Develop branch updated on remote
→ Currently on develop branch
✓ Command completed successfully
```

### 3.7 vit merge-main

#### 3.7.1 Purpose
Squash merge develop into main and create release tag (final release step).

#### 3.7.2 Prerequisites
- Must be on develop branch
- Develop branch must be clean
- Main branch must be clean
- Both branches must be in sync with remote

#### 3.7.3 Command Flow
1. Verify current branch is develop
2. Check develop for uncommitted changes
3. Switch to main and check for uncommitted changes
4. Fetch remote updates and check sync status for both branches
5. Switch to main
6. Squash merge develop: `git merge develop --squash`
7. Handle conflicts with interactive prompt if needed
8. Create explicit commit with release message
9. Create annotated tag for current version
10. Push main branch and tag to remote
11. Stay on main branch

#### 3.7.4 Conflict Resolution
Interactive prompt when merge conflicts occur:
- Option to force merge using develop's version
- Option to abort and resolve manually

#### 3.7.5 Example Output
```bash
$ vit merge-main
→ Current branch: develop
→ Checking for uncommitted changes on develop...
✓ develop branch clean
→ Running: git checkout main
→ Checking for uncommitted changes on main...
✓ main branch clean
→ Running: git fetch origin
→ Checking if main is in sync with remote...
✓ main branch in sync with remote
→ Running: git checkout develop
→ Checking if develop is in sync with remote...
✓ develop branch in sync with remote
→ Running: git checkout main
→ Running: git merge develop --squash
✓ develop squashed into main successfully
→ Reading version from package.json: 1.2.3
→ Running: git commit -m "release: merge develop into main for v1.2.3"
→ Running: git tag -a v1.2.3 -m "Release version 1.2.3"
→ Running: git push origin main
→ Running: git push origin v1.2.3
✓ Release v1.2.3 squashed and published to main
✓ Tag v1.2.3 created and pushed
→ Currently on main branch
✓ Command completed successfully
```

### 3.8 vit status

#### 3.8.1 Purpose
Enhanced status showing workflow context, version information, and Git status.

#### 3.8.2 Prerequisites
- Must be in a Git repository

#### 3.8.3 Information Displayed
1. Current branch with workflow context
2. Version information from package.json and manifest.json
3. Branch sync status with remote
4. Standard Git status output

#### 3.8.4 Command Flow
1. Get current branch name and determine type
2. Read versions from both JSON files (if they exist)
3. Check sync status with remote
4. Display standard Git status

#### 3.8.5 Example Output
```bash
$ vit status
→ Current branch: feat/shopping-cart (feature branch)
→ Package version: 0.2.1
→ Manifest version: 0.2.1
✓ Versions in sync
→ Branch sync: 2 commits ahead of remote

Git status:
On branch feat/shopping-cart
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   src/components/cart.js

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/popup.js
	modified:   manifest.json
	modified:   README.md

✓ Status displayed successfully
```

## 4. Implementation Guidelines

### 4.1 Code Organization

#### 4.1.1 File Responsibilities
- **bin/vit.js**: Command-line entry point and argument parsing
- **lib/index.js**: Main command routing and exports
- **lib/vit/[command].js**: Individual command implementations
- **lib/vit/git.js**: Git command execution and error handling
- **lib/vit/files.js**: File system operations for JSON files
- **lib/vit/validation.js**: Input validation and branch name checking
- **lib/vit/output.js**: Colored console output and formatting

#### 4.1.2 Coding Standards
- **Comments**: Comprehensive commenting for all functions and complex logic
- **Error Handling**: Graceful error handling with descriptive messages
- **Verbose Output**: Show all Git commands being executed
- **Consistency**: Consistent output formatting across all commands
- **Modularity**: Reusable utility functions for common operations

### 4.2 Testing Strategy

#### 4.2.1 No Unit Testing
Based on project requirements, unit testing is excluded to focus on rapid development and deployment.  
The testing of all the command will be done in a external project called "vince-dev-tools_testing/", which you are not in charge of.

#### 4.2.2 Manual Testing Approach
- **Development Environment**: Use separate vince-dev-tools_testing for testing
- **Real Scenarios**: Test with actual Chrome extension project structure
- **Edge Cases**: Manually test error conditions and edge cases
- **Integration Testing**: Test complete workflows from init to release

#### 4.2.3 Test Files
Create dummy test files in vince-dev-tools_testing:
```json
// package.json
{
  "name": "test-extension",
  "version": "0.0.0",
  "description": "Test Chrome extension"
}

// manifest.json
{
  "manifest_version": 3,
  "name": "just a test",
  "version": "0.0.0",
  "description": "Just a dummy test app."
}
```

### 4.3 Git Workflow Strategy

#### 4.3.1 Branching Model
The tool implements and enforces a streamlined Git Flow model:

- **main**: Production-ready, stable releases only
- **develop**: Integration branch for completed features
- **feat/feature-name**: Feature development branches
- **fix/fix-name**: Bug fix branches

#### 4.3.2 Merge Strategies
- **feat/fix → develop**: Normal merge (preserve commit history)
- **develop → main**: Squash merge (clean release history)

#### 4.3.3 Conventional Commits
Enforce Conventional Commits 1.0.0 specification:
- **Format**: `type(scope): description`
- **Supported Types**: feat, fix, chore, docs, refactor, style
- **Auto-prefixing**: Based on branch name or explicit flags

### 4.4 Version Management

#### 4.4.1 Semantic Versioning
Follow semantic versioning (X.Y.Z) with specific interpretation:
- **X (Major)**: 0 = pre-1.0 release, 1+ = major releases
- **Y (Minor)**: Significant features, major modules, milestones
- **Z (Patch)**: Bug fixes, small improvements, optimizations

#### 4.4.2 Dual File Management
Maintain version synchronization between:
- **package.json**: NPM ecosystem version
- **manifest.json**: Chrome extension version

## 5. Installation and Usage

### 5.1 Package Configuration

#### 5.1.1 package.json Setup
```json
{
  "name": "vince-dev-tools",
  "version": "1.0.0",
  "description": "Personal developer productivity toolkit",
  "bin": {
    "vit": "./bin/vit.js"
  },
  "main": "lib/index.js",
  "private": true,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/username/vince-dev-tools.git"
  }
}
```

#### 5.1.2 Installation Command
```bash
npm install git+https://github.com/username/vince-dev-tools.git --save-dev
```

### 5.2 Project Integration

#### 5.2.1 Target Project Setup
Add to target project's package.json:
```json
{
  "devDependencies": {
    "vince-dev-tools": "git+https://github.com/username/vince-dev-tools.git"
  }
}
```

#### 5.2.2 Usage
```bash
# Use with npx (recommended)
npx vit init
npx vit newbranch feat/new-feature
npx vit commit add new functionality

# Or install globally
npm install -g git+https://github.com/username/vince-dev-tools.git
vit init
```

## 6. Future Considerations(out of scope)

### 6.1 Extensibility

The modular architecture supports future additions:
- Additional command implementations in `lib/vit/`
- Additional commands other than vit in `lib/new-command/`
- Extended validation rules
- Additional file format support
- Integration with other development tools

### 6.2 Potential Enhancements

- Configuration file support for customizable behavior
- Additional conventional commit types
- Integration with CI/CD pipelines
- Support for other project types beyond Chrome extensions

## 7. Complete Workflow Example

### 7.1 Project Setup to First Release

```bash
# 0. Verify Node.js is installed (one-time check)
node --version
npm --version
# If these commands fail, install Node.js from https://nodejs.org first

# 1. Create project directory and basic files
mkdir my-chrome-extension
cd my-chrome-extension
# (create manifest.json, package.json, source files manually)

# 2. Initialize npm project (if package.json doesn't exist)
npm init -y

# 3. Install dev tools
npm install git+https://github.com/username/vince-dev-tools.git --save-dev

# 4. Initialize Git with vit
vit init
# → Sets up Git, creates branches, prompts for remote

# 5. Develop first feature
vit newbranch feat/popup-interface
# (work on feature, edit files)
git add src/popup.html src/popup.js
vit commit create basic popup interface
git add src/styles.css
vit commit add styling to popup
git add src/popup.js
vit commit fix button click handler

# 6. Integrate and release
vit merge-dev              # Merge to develop (preserve history)
vit version minor          # Bump to 0.1.0
vit merge-main            # Create release (squash to main, create tag)

# 7. Continue development
git checkout develop
vit newbranch feat/next-feature
```

This blueprint provides comprehensive guidance for implementing the vince-dev-tools productivity toolkit, ensuring consistent development practices and efficient workflow automation.  
  
  IMPORTANT: As an AI, this project, vince-dev-tools will be backed up on github.com. You are not allowed to run git command yourself when building the project, unless explicitly instructed otherwise. The developer (me - Vincent) allways does that myself.