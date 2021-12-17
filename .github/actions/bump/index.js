const core = require('@actions/core');
const shell = require('shelljs');
const simpleGit = require('simple-git');
const package = require('./package.json');
const semver = require('semver');

const git = simpleGit();

const version = core.getInput('version');
const baseBranch = core.getInput('base_branch');
const createPullRequest = core.getInput('create_pull_request') === 'true';

const getNewVersion = () => {
    if (!['major', 'minor', 'patch'].includes(version)) {
        throw new Error('invalid version!');
    }

    return semver.inc(package.version, version);
};

const updatePackages = async (newBranch) => {
    try {
        await git.fetch().checkout(baseBranch);

        if (createPullRequest) {
            await git.checkoutLocalBranch(newBranch);
        }

        shell.exec(`npm version ${version} --no-git-tag-version`);

        await git.add('.');
    } catch (err) {
        throw err;
    }
};

const newVersionNumber = getNewVersion();
const newBranch = `bump-version-${newVersionNumber}`;

core.setOutput("new_version_number", newVersionNumber);
core.setOutput("new_branch", newBranch);

updatePackages(newBranch);
