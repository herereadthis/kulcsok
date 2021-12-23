# action-bump-node

This JavaScript-based Github action will update npm package files in specified directories for node.js applications.

## Inputs

All inputs are required.

* `base_branch` {string} the starting branch to make the version bump commit
* `version` {string[major|minor|patch]} semver increment
* `create_pull_request` {string[true|false]} whether to create a separate branch + pull request for commit
* `package_directories` {string} whether to create a separate branch + pull request for commit

## Outputs

* `new_branch` {string} The name of the new branch. Unused if no pull request created
* `new_version_number` {string} semver version of new bumped version