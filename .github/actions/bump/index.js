const core = require('@actions/core');
const shell = require('shelljs');
const simpleGit = require('simple-git');
const package = require('./package.json');

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

    if (version === 'major') {
        packageValues[0] = parseInt(packageValues[0]) + 1;
    } else if (version === 'minor') {
        packageValues[1] = parseInt(packageValues[1]) + 1;
    } else {
        packageValues[2] = parseInt(packageValues[2]) + 1;
    }

    return packageValues.join('.');
};

const updatePackages = async (newBranch) => {
    try {
        await git.checkoutBranch(newBranch, baseBranch);

        shell.exec(`npm version ${version} --no-git-tag-version`);

        await git
            .add('package.json')
            .add('package-lock.json');

    } catch (err) {
        throw err;
    }
};

const newVersionNumber = getNewVersion();
const newBranch = `bump-version-${newVersionNumber}`;

console.log('***');
console.log(`New Vervsion is: <${newVersionNumber}>`);
console.log(`New Branch is: <${newBranch}>`);
console.log('***');

core.setOutput("new_version_number", newVersionNumber);
core.setOutput("new_branch", newBranch);

updatePackages(newBranch);
