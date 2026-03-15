#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);

// ─── Windows check ─────────────────────────────────────────────
if (process.platform === "win32") {
  console.warn("⚠️  Windows detected: git-hook-prepush requires a POSIX shell to run.");
  console.warn("   Please use one of the following:");
  console.warn("   - Git Bash (https://gitforwindows.org/)");
  console.warn("   - WSL (https://learn.microsoft.com/en-us/windows/wsl/)");
  console.warn("");
  console.warn("   Run your git commands from Git Bash or WSL for the hook to work.");
  process.exit(1);
}

// ─── Help ──────────────────────────────────────────────────────
if (args.includes("--help")) {
  console.log("git-hook-prepush — Shared Git pre-push hook with build check");
  console.log("");
  console.log("Usage:");
  console.log("  npx git-hook-prepush            Install the pre-push hook");
  console.log("  npx git-hook-prepush --verify   Check if hook is installed");
  console.log("  npx git-hook-prepush --uninstall Remove the hook");
  console.log("  npx git-hook-prepush --help     Show this help");
  console.log("");
  console.log("Skip the build check at push time:");
  console.log("  SKIP_BUILD=1 git push");
  process.exit(0);
}

// ─── Find project root ─────────────────────────────────────────
function findProjectRoot() {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (
      fs.existsSync(path.join(dir, "package.json")) &&
      !dir.includes("node_modules")
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

const projectRoot = findProjectRoot();
const hooksDir = path.join(projectRoot, ".githooks");
const hookSource = path.join(__dirname, "..", "hooks", "pre-push");
const hookDest = path.join(hooksDir, "pre-push");

// ─── Verify ────────────────────────────────────────────────────
if (args.includes("--verify")) {
  const hookInstalled = fs.existsSync(hookDest);
  let gitConfigOk = false;
  try {
    const result = execSync("git config core.hooksPath", { cwd: projectRoot })
      .toString()
      .trim();
    gitConfigOk = result === ".githooks";
  } catch {
    // not configured
  }

  console.log("git-hook-prepush status:");
  console.log(`  Hook file:  ${hookInstalled ? "✅ installed" : "❌ missing"} (${hookDest})`);
  console.log(`  Git config: ${gitConfigOk ? "✅ core.hooksPath = .githooks" : "❌ not configured"}`);
  console.log("");
  console.log("Configuration (env vars):");
  console.log(`  BUILD_BRANCHES         = ${process.env.BUILD_BRANCHES || "dev (default)"}`);
  console.log(`  BUILD_BRANCH_PATTERNS  = ${process.env.BUILD_BRANCH_PATTERNS || "alpha-[0-9]+ (default)"}`);
  console.log(`  BUILD_CMD              = ${process.env.BUILD_CMD || "npm run build (default)"}`);
  process.exit(hookInstalled && gitConfigOk ? 0 : 1);
}

// ─── Uninstall ─────────────────────────────────────────────────
if (args.includes("--uninstall")) {
  if (fs.existsSync(hookDest)) {
    fs.rmSync(hookDest);
    console.log("✅ Removed .githooks/pre-push");
  } else {
    console.log("ℹ️  Hook file not found, nothing to remove.");
  }
  try {
    execSync("git config --unset core.hooksPath", { cwd: projectRoot });
    console.log("✅ Reset git core.hooksPath");
  } catch {
    console.log("ℹ️  git core.hooksPath was not set, skipping.");
  }
  process.exit(0);
}

// ─── Install ───────────────────────────────────────────────────

// Validate hook source exists
if (!fs.existsSync(hookSource)) {
  console.error("❌ Hook source file not found:", hookSource);
  console.error("   Try reinstalling: npm install git-hook-prepush");
  process.exit(1);
}

// Create .githooks directory
try {
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
} catch (err) {
  console.error("❌ Failed to create .githooks directory:", err.message);
  process.exit(1);
}

// Copy hook file
try {
  fs.copyFileSync(hookSource, hookDest);
  fs.chmodSync(hookDest, "755");
} catch (err) {
  console.error("❌ Failed to install hook file:", err.message);
  process.exit(1);
}

// Configure git to use .githooks
try {
  execSync("git config core.hooksPath .githooks", { cwd: projectRoot });
} catch {
  console.warn("⚠️  Could not set git core.hooksPath — is this a git repository?");
  console.warn("   Run manually: git config core.hooksPath .githooks");
}

console.log("✅ git-hook-prepush installed at .githooks/pre-push");
console.log("");
console.log("   git push               → runs build check on protected branches");
console.log("   SKIP_BUILD=1 git push  → skip build check");
