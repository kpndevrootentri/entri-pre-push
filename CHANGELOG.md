# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.1.0] - 2026-03-15

### Added

- **`.githooksrc.json` config file support** — teams can now commit a project-level config file to share hook settings. Supports `buildBranches`, `buildBranchPatterns`, `buildCmd`, and `skipBuildIfUnchanged` fields. Environment variables always take precedence.
- **`--verify` CLI flag** — run `npx git-hook-prepush --verify` to check if the hook is installed correctly and display the active configuration.
- **`--uninstall` CLI flag** — run `npx git-hook-prepush --uninstall` to cleanly remove the hook and reset `git core.hooksPath`.
- **`--help` CLI flag** — run `npx git-hook-prepush --help` to display usage information.
- **Smart skip via `SKIP_BUILD_IF_UNCHANGED`** — set a space-separated list of paths (env var or `skipBuildIfUnchanged` in config file); the build is skipped automatically if none of those paths changed since the remote.
- **`.githooksrc.example.json`** — example config file included in the package for quick setup.

### Changed

- **Error handling in `bin/setup.js`** — setup now validates the hook source file exists, provides descriptive error messages for file operation failures, and warns (instead of silently ignoring) when `git config` cannot be set.
- **Detached HEAD handling** — the pre-push hook now detects detached HEAD state and exits cleanly with a warning instead of unpredictable behavior.
- **Windows detection** — setup now detects Windows and exits with a clear message directing users to Git Bash or WSL.
- **README** — updated with config file docs, CLI command reference, Windows support section, and smart skip usage.

---

## [1.0.0] - 2026-03-13

### Added

- Initial release
- Pre-push hook that runs a build check before pushing to protected branches
- Configurable via `BUILD_BRANCHES`, `BUILD_BRANCH_PATTERNS`, and `BUILD_CMD` environment variables
- Skip mechanism via `SKIP_BUILD=1`
- Automatic hook installation via `postinstall`
