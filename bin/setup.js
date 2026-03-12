#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Find project root (where package.json is)
function findProjectRoot() {
  let dir = process.cwd();
  // Walk up from node_modules to find the project root
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

// Create .githooks directory
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

// Copy hook file
fs.copyFileSync(hookSource, hookDest);
fs.chmodSync(hookDest, "755");

// Configure git to use .githooks
try {
  execSync("git config core.hooksPath .githooks", { cwd: projectRoot });
} catch {
  // Not a git repo, skip
}

console.log("✅ entri-pre-push hook installed at .githooks/pre-push");
console.log("");
console.log("   git push          → runs build check on protected branches");
console.log("   git push -o skip  → skip build check");
