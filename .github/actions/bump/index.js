const core = require('@actions/core');
// const github = require('@actions/github');
const shell = require('shelljs');
const semverRegex = require('semver-regex');
const simpleGit = require('simple-git');

const git = simpleGit();

shell.config.verbose = true;
const versionNumber = core.getInput('version');
const baseBranch = core.getInput('base_branch');
const actor = core.getInput('actor');
const email = core.getInput('email');

console.log(`Version number is: ${versionNumber}`);
console.log(`Base Branch is: ${baseBranch}`);
console.log(`Actor is ${actor}`);
console.log(`Email is ${email}`);

if (!semverRegex().test(versionNumber)) {
    throw new Error('Version number is not semver!');
}

try {
    await git
        .addConfig('user.email', getInput(email))
        .addConfig('user.name', getInput(actor));
} catch (err) {
    throw err;
}

shell.exec(`git checkout ${baseBranch}`);
shell.exec(`git checkout -b bump-version-${versionNumber}`);
shell.exec(`git add package.json package-lock.json`);
shell.exec(`npm version ${versionNumber} --no-git-tag-version`);
shell.exec(`git add package.json package-lock.json`);
shell.exec(`git commit -m "Bump version ${versionNumber}"`);
shell.exec(`git push origin bump-version-${versionNumber}`);

console.log(`Pushed branch bump-version-${versionNumber}`);
