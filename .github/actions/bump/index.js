const core = require('@actions/core');
const shell = require('shelljs');
const simpleGit = require('simple-git');
const semver = require('semver');

const package = require('./package.json');

const git = simpleGit();

const VERSION = core.getInput('version');
const BASE_BRANCH = core.getInput('base_branch');
const CREATE_PULL_REQUEST = core.getInput('create_pull_request') === 'true';

/**
 * Directory list of packages that will need updates. Modify as needed.
 */
const PACKAGE_DIRECTORIES = ['./'];

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
 * Set up configuration and local branch
 * User is github actions-bot
 * https://github.com/actions/checkout#push-a-commit-using-the-built-in-token
 * 
 * @returns {function} git
 */
const initializeGit = () => {
    return git
        .addConfig('user.email', 'github-actions')
        .addConfig('user.name', 'github-actions@github.com')
        .fetch()
        .checkout(BASE_BRANCH);
}

/**
 * Update all package files based on package directory list
 */
const updatePackages = () => {
    PACKAGE_DIRECTORIES.forEach((directory) => {
        shell.exec(`cd ${directory};npm version ${VERSION} --no-git-tag-version`);
    });
};

/**
 * Bump package versions and push the commit.
 * 
 * @param {string} newVersionNumber 
 */
const pushVersionBump = async (newVersionNumber) => {
    try {
        await initializeGit();
        updatePackages();
        await git
            .add('.')
            .commit(getCommitMessage(newVersionNumber))
            .push('origin', BASE_BRANCH);
    } catch (err) {
        core.setFailed(err.message);
        throw err;
    }
};

/**
 * Bump package versions in a new branch and create a pull request.
 * 
 * @param {string} newVersionNumber 
 * @param {string} newBranch 
 */
const createVersionBumpPullRequest = async (newVersionNumber, newBranch) => {
    try {
        await initializeGit();
        await git.checkoutLocalBranch(newBranch);
        updatePackages();
        await git
            .add('.')
            .commit(getCommitMessage(newVersionNumber))
            .push('origin', newBranch);
    } catch (err) {
        core.setFailed(err.message);
        throw err;
    }
}

const newVersionNumber = getNewVersion();
const newBranch = `bump-version-${newVersionNumber}`;

core.setOutput("new_version_number", newVersionNumber);
core.setOutput("new_branch", newBranch);

if (CREATE_PULL_REQUEST) {
    createVersionBumpPullRequest(newVersionNumber, newBranch);
} else {
    pushVersionBump(newVersionNumber);
}
