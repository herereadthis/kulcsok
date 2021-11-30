const core = require('@actions/core');
const github = require('@actions/github');
const shell = require('shelljs');
const semverRegex = require('semver-regex');
const simpleGit = require('simple-git');

const git = simpleGit();

shell.config.verbose = true;

const versionNumber = core.getInput('version');
const baseBranch = core.getInput('base_branch');
const actor = github.context.actor;
const email = `${actor}@email.com`;

const newBranch = `bump-version-${versionNumber}`

console.log(`Version number is: ${versionNumber}`);
console.log(`Base Branch is: ${baseBranch}`);
console.log(`New Branch is: ${newBranch}`);
console.log(`Actor is ${actor}`);
console.log(`Email is ${email}`);

// console.log('github context');
// console.log(github.context);

if (!semverRegex().test(versionNumber)) {
    throw new Error('Version number is not semver!');
}

const configure = async () => {
    try {
        await git
            .addConfig('user.email', email)
            .addConfig('user.name', actor)
            .addConfig('author.email', email)
            .addConfig('author.name', actor)
            .addConfig('committer.email', email)
            .addConfig('committer.name', actor)
            .checkoutBranch(newBranch, baseBranch);

        shell.exec(`npm version ${versionNumber} --no-git-tag-version`);

        await git
            .add('package.json')
            .add('package-lock.json')
            .commit(`Bump version ${versionNumber}`)
            .push('origin', newBranch);

        console.log(`Pushed branch ${newBranch}`);
    } catch (err) {
        throw err;
    }
};

configure();

