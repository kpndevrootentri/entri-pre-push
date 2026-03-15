# git-hook-prepush

A shared Git pre-push hook that runs a build check before allowing pushes to protected branches. Prevents broken builds from being pushed to important branches like `dev`, `alpha-1`, `alpha-2`, etc.

## Installation

### npm

```bash
npm install git-hook-prepush --save-dev
```

### yarn

```bash
yarn add git-hook-prepush --dev
```

The hook is automatically installed during `postinstall`. It creates a `.githooks/pre-push` file and configures Git to use it.

## How It Works

When you `git push` to a protected branch, the hook runs your build command. If the build fails, the push is blocked.

```
git push origin dev
# 🔨 Pre-push: Running build check for branch 'dev'...
# ✅ Build succeeded. Pushing...
```

```
git push origin dev
# 🔨 Pre-push: Running build check for branch 'dev'...
# ❌ Build failed. Push to 'dev' has been blocked.
```

### Skip the build check

```bash
SKIP_BUILD=1 git push
```

### Smart skip — only build if relevant files changed

Set `SKIP_BUILD_IF_UNCHANGED` to a space-separated list of paths. If none of those paths changed since the remote, the build is skipped automatically.

```bash
# Skip build if nothing in src/ or package.json changed
SKIP_BUILD_IF_UNCHANGED="src/ package.json" git push
```

You can also export it so it applies to every push:

```bash
export SKIP_BUILD_IF_UNCHANGED="src/ package.json tsconfig.json"
```

## Configuration

Configuration is loaded in this order (highest priority first):

1. **Environment variables** — set in shell or CI
2. **`.githooksrc.json`** — project-level config file (commit this to share with your team)
3. **Defaults**

### Config file (recommended for teams)

Create a `.githooksrc.json` at your project root:

```json
{
  "buildBranches": ["dev", "staging", "main"],
  "buildBranchPatterns": ["alpha-[0-9]+", "beta-[0-9]+", "release-.*"],
  "buildCmd": "npm run build",
  "skipBuildIfUnchanged": ["src/", "package.json", "tsconfig.json"]
}
```

A `.githooksrc.example.json` template is included in the package.

### Environment variables

Add these to your `.bashrc`, `.zshrc`, or CI config (env vars override the config file):

### `BUILD_BRANCHES`

Exact branch names that require a build check (space-separated).

**Default:** `dev`

```bash
export BUILD_BRANCHES="dev staging main"
```

### `BUILD_BRANCH_PATTERNS`

Regex patterns for matching branch names (space-separated). Uses extended regex (`grep -E`).

**Default:** `alpha-[0-9]+`

```bash
export BUILD_BRANCH_PATTERNS="alpha-[0-9]+ beta-[0-9]+ release-.*"
```

This matches branches like `alpha-1`, `alpha-2`, `beta-1`, `release-2.0`, etc.

### `BUILD_CMD`

The build command to run.

**Default:** `npm run build`

```bash
export BUILD_CMD="yarn build"
```

## CLI Commands

```bash
npx git-hook-prepush             # Install the hook
npx git-hook-prepush --verify   # Check installation status + show config
npx git-hook-prepush --uninstall # Remove the hook
npx git-hook-prepush --help     # Show usage
```

## Manual Setup

If the hook wasn't installed automatically, run:

```bash
# npm
npx git-hook-prepush

# yarn
yarn git-hook-prepush
```

## Windows Support

This package uses a POSIX shell script for the git hook. On Windows, use one of:

- **Git Bash** — [gitforwindows.org](https://gitforwindows.org/)
- **WSL** — [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/)

Run all `git push` and `npm install` commands from Git Bash or WSL, not from CMD or PowerShell.

## Uninstall

Remove the package and reset the Git hooks path:

```bash
# npm
npm uninstall git-hook-prepush

# yarn
yarn remove git-hook-prepush

# Reset Git hooks path
git config --unset core.hooksPath
rm -rf .githooks
```

## License

MIT
