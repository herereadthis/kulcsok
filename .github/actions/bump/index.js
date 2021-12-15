const core = require('@actions/core');
const shell = require('shelljs');
const simpleGit = require('simple-git');
const package = require('./package.json');
const semver = require('semver');

const git = simpleGit();

shell.config.verbose = true;

const version = core.getInput('version');
const baseBranch = core.getInput('base_branch');

const getNewVersion = () => {
    if (!['major', 'minor', 'patch'].includes(version)) {
        throw new Error('invalid version!');
    }

    const packageVersion = package.version;
    const packageValues = packageVersion.split('.');

    const semverStyle = semver.inc(package.version, version);

    console.log('semver?');
    console.log(semverStyle);
    console.log('semver?');

    if (version === 'major') {
        packageValues[0] = parseInt(packageValues[0]) + 1;
        packageValues[1] = 0;
        packageValues[2] = 0;
    } else if (version === 'minor') {
        packageValues[1] = parseInt(packageValues[1]) + 1;
        packageValues[2] = 0;
    } else {
        packageValues[2] = parseInt(packageValues[2]) + 1;
    }

    return packageValues.join('.');
};

const updatePackages = async (newBranch) => {
    console.log(`newBranch is: ${newBranch}`);
    console.log(`baseBranch is: ${baseBranch}`);
    try {
        await git.fetch()
            .checkout(baseBranch)
            .checkoutLocalBranch(newBranch);

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
