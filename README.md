# entri-pre-push

A shared Git pre-push hook that runs a build check before allowing pushes to protected branches. Prevents broken builds from being pushed to important branches like `dev`, `alpha-1`, `alpha-2`, etc.

## Installation

### npm

```bash
npm install entri-pre-push --save-dev
```

### yarn

```bash
yarn add entri-pre-push --dev
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
git push -o skip
```

## Configuration

Configure via environment variables. Add these to your `.bashrc`, `.zshrc`, or `.env` file:

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

## Manual Setup

If the hook wasn't installed automatically, run:

```bash
# npm
npx entri-pre-push

# yarn
yarn entri-pre-push
```

## Uninstall

Remove the package and reset the Git hooks path:

```bash
# npm
npm uninstall entri-pre-push

# yarn
yarn remove entri-pre-push

# Reset Git hooks path
git config --unset core.hooksPath
rm -rf .githooks
```

## License

MIT
