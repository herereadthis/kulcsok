const core = require('@actions/core');
const shell = require('shelljs');
const simpleGit = require('simple-git');
const semver = require('semver');

const package = require('./package.json');

const git = simpleGit();

// Action inputs
const VERSION = core.getInput('version');
const BASE_BRANCH = core.getInput('base_branch');
const CREATE_PULL_REQUEST = core.getInput('create_pull_request') === 'true';
const PACKAGE_DIRECTORIES = JSON.parse(core.getInput('package_directories'));

/**
 * Default commit message. Be careful when modifying as this commit may be
 * tracked by other workflows and/or bots.
 * 
 * @param {string} newVersionNumber 
 * @returns {string} commit message
 */
const getCommitMessage = newVersionNumber => `Bump version to ${newVersionNumber}`;

/**
 * Gets new version number by semver.
 * 
 * @returns (string) semver version
 */
const getNewVersion = () => {
    if (!['major', 'minor', 'patch'].includes(VERSION)) {
        throw new Error('invalid version!');
    }

    return semver.inc(package.version, VERSION);
};

/**
 * Update all package files based on package directory list
 */
const updatePackages = () => {
    PACKAGE_DIRECTORIES.forEach((directory) => {
        shell.exec(`cd ${directory};npm version ${VERSION} --no-git-tag-version`);
    });
};

/**
 * Set up configuration and local branch
 * User is github actions-bot
 * https://github.com/actions/checkout#push-a-commit-using-the-built-in-token
 * 
 * @param {string} baseBranch - where to start
 * @returns {function}
 */
const initializeGit = (baseBranch) => {
    return git
        .addConfig('user.email', 'github-actions')
        .addConfig('user.name', 'github-actions@github.com')
        .fetch()
        .checkout(baseBranch);
}

/**
 * Bump package versions and push the commit.
 * 
 * @param {string} baseBranch - the starting branch at which to make the commit
 * @param {string} commitMessage - text for commit
 */
const pushVersionBump = async (baseBranch, commitMessage) => {
    try {
        await initializeGit(baseBranch);
        updatePackages();
        await git
            .add('.')
            .commit(commitMessage)
            .push('origin', baseBranch);
    } catch (err) {
        core.setFailed(err.message);
        throw err;
    }
};

/**
 * Bump package versions in a new branch and create a pull request.
 * 
 * @param {string} baseBranch - the starting branch at which to create a new branch
 * @param {string} newBranch - the name of the new branch
 * @param {string} commitMessage - text for commit
 */
const createVersionBumpPullRequest = async (baseBranch, newBranch, commitMessage) => {
    try {
        await initializeGit(baseBranch);
        await git.checkoutLocalBranch(newBranch);
        updatePackages();
        await git
            .add('.')
            .commit(commitMessage)
            .push('origin', newBranch);
    } catch (err) {
        core.setFailed(err.message);
        throw err;
    }
}

const newVersionNumber = getNewVersion();
const newBranch = `bump-version-${newVersionNumber}`;
const commitMessage = getCommitMessage(newVersionNumber);

core.setOutput("new_version_number", newVersionNumber);
core.setOutput("new_branch", newBranch);

if (CREATE_PULL_REQUEST) {
    createVersionBumpPullRequest(BASE_BRANCH, newBranch, commitMessage);
} else {
    pushVersionBump(BASE_BRANCH, commitMessage);
}
