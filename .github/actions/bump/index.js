import * as core from '@actions/core';
import shell from 'shelljs';
import semverRegex from 'semver-regex';

shell.config.verbose = true;
const versionNumber = core.getInput('version');
const baseBranch = core.getInput('base_branch');

console.log(`Version number is: ${versionNumber}`);
console.log(`Base Branch is: ${baseBranch}`);

if (!semverRegex().test(versionNumber)) {
    throw new Error('Version number is not semver!');
}

shell.exec(`git checkout ${baseBranch}`);
shell.exec(`git checkout -b bump-version-${versionNumber}`);
shell.exec(`git add package.json package-lock.json`);
shell.exec(`npm version ${versionNumber} --no-git-tag-version`);
shell.exec(`git add package.json package-lock.json`);
shell.exec(`git commit -m "Bump version ${versionNumber}"`);
shell.exec(`git push origin bump-version-${versionNumber}`);

console.log(`Pushed branch bump-version-${versionNumber}`);
