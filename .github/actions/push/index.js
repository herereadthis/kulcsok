const core = require('@actions/core');
const github = require('@actions/github');
const shell = require('shelljs');
const semverRegex = require('semver-regex');
const simpleGit = require('simple-git');

const git = simpleGit();

shell.config.verbose = true;

const versionNumber = core.getInput('version');
const baseBranch = core.getInput('base_branch');
const repoToken = core.getInput('repo_token');

const actor = github.context.actor;
const email = `${actor}@email.com`;

const newBranch = `bump-version-${versionNumber}`

console.log(`Github token is: ${repoToken}`);
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

if (repoToken === undefined || repoToken === null) {
    core.warning('No github_token has been detected, the action may fail if it needs to use the API');
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
            .fetch('origin')
            .checkout(newBranch);
        shell.exec(`
            gh pr create --base ${baseBranch} --title "Bump version ${versionNumber}" --body "new version bump ${versionNumber}"
        `);
    } catch (err) {
        throw err;
    }
};

configure();
