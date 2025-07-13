# vince-dev-tools

A personal developer productivity toolkit designed to standardize and streamline common development workflows for Chrome extension projects. The toolkit provides a command-line interface called `vit` that abstracts away common Git operations, enforces conventional commits, and automates version management across multiple files.

## Features

- **Git Flow Branching Model**: Enforces consistent branching with main/develop/feature/fix branches
- **Conventional Commits**: Automated commit formatting with smart type detection
- **Version Synchronization**: Keeps package.json and manifest.json versions in sync
- **Transparent Operations**: Shows all Git commands being executed
- **Interactive Conflict Resolution**: Handles merge conflicts with user prompts
- **Enhanced Status**: Shows workflow context and version information

## Installation

### From GitHub (Recommended)

```bash
npm install git+https://github.com/vincenth67/vince-dev-tools.git --save-dev
```

### Usage

```bash
# Use with npx (recommended)
npx vit init
npx vit newbranch feat/new-feature
npx vit commit add new functionality

# Or install globally
npm install -g git+https://github.com/vincenth67/vince-dev-tools.git
vit init
```

## Commands

### `vit init`

Initialize a new project with Git Flow branching model and version setup.

**Prerequisites**: Not currently in a Git repository

**Example**:
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

### `vit newbranch <name>`

Create and switch to a new feature or fix branch from develop.

**Prerequisites**: Must be on `develop` branch, working directory clean

**Format**: `vit newbranch feat/feature-name` or `vit newbranch fix/fix-name`

**Example**:
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

### `vit delbranch [name]`

Safely delete feature or fix branches with proper validation.

**Prerequisites**: Cannot delete `main` or `develop` branches

**Format**: `vit delbranch` (delete current branch) or `vit delbranch feat/branch-name`

**Example**:
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

### `vit commit <message>`

Smart commit with conventional commit formatting and type/scope support.

**Prerequisites**: Must be on feat/ or fix/ branch, must have staged changes

**Formats**:
- `vit commit message text` - Auto-prefix from branch
- `vit commit -t type message text` - Explicit type
- `vit commit -s scope message text` - Auto-prefix + scope
- `vit commit -t type -s scope message text` - Explicit type + scope

**Supported Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`

**Examples**:
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

### `vit version <type>`

Bump version numbers in both package.json and manifest.json following semantic versioning.

**Prerequisites**: Working directory clean, both JSON files exist, versions match

**Types**:
- `patch` - Bug fixes (increment Z: 1.2.3 → 1.2.4)
- `minor` - New features (increment Y, reset Z: 1.2.3 → 1.3.0)
- `major` - Breaking changes (increment X, reset Y,Z: 1.2.3 → 2.0.0)

**Example**:
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

### `vit merge-dev`

Merge current feature/fix branch into develop branch (normal merge, preserve history).

**Prerequisites**: Must be on feat/ or fix/ branch, both branches clean and in sync

**Example**:
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

### `vit merge-main`

Squash merge develop into main and create release tag (final release step).

**Prerequisites**: Must be on develop branch, both branches clean and in sync

**Example**:
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

### `vit status`

Enhanced status showing workflow context, version information, and Git status.

**Example**:
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

## Complete Workflow Example

### Project Setup to First Release

```bash
# 1. Create project directory and basic files
mkdir my-chrome-extension
cd my-chrome-extension
# (create manifest.json, package.json, source files manually)

# 2. Initialize npm project (if package.json doesn't exist)
npm init -y

# 3. Install dev tools
npm install git+https://github.com/vincenth67/vince-dev-tools.git --save-dev

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

## Git Workflow Strategy

### Branching Model
- **main**: Production-ready, stable releases only
- **develop**: Integration branch for completed features
- **feat/feature-name**: Feature development branches
- **fix/fix-name**: Bug fix branches

### Merge Strategies
- **feat/fix → develop**: Normal merge (preserve commit history)
- **develop → main**: Squash merge (clean release history)

### Conventional Commits
Enforces Conventional Commits 1.0.0 specification:
- **Format**: `type(scope): description`
- **Supported Types**: feat, fix, chore, docs, refactor, style
- **Auto-prefixing**: Based on branch name or explicit flags

## Version Management

### Semantic Versioning
Follows semantic versioning (X.Y.Z) with specific interpretation:
- **X (Major)**: 0 = pre-1.0 release, 1+ = major releases
- **Y (Minor)**: Significant features, major modules, milestones
- **Z (Patch)**: Bug fixes, small improvements, optimizations

### Dual File Management
Maintains version synchronization between:
- **package.json**: NPM ecosystem version
- **manifest.json**: Chrome extension version

## Requirements

- Node.js 14.0.0 or higher
- Git installed and configured
- Chrome extension project with package.json and manifest.json files

## License

This is a private development tool. All rights reserved.