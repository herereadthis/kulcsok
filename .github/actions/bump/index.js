const core = require('@actions/core');
const github = require('@actions/github');
const chalk = require('chalk');
const shell = require('shelljs');

shell.config.verbose = true;
const versionNumber = core.getInput('version');
const baseBranch = core.getInput('base_branch');

console.log(chalk.green(`Version number is: ${versionNumber}`));
console.log(chalk.green(`Base Branch is: ${baseBranch}`));
shell.exec(`git checkout ${baseBranch}`);
shell.exec(`git checkout -b bump-version-${baseBranch}`);
shell.exec(`git add package.json package-lock.json`);
shell.exec(`npm version ${versionNumber} --no-git-tag-version`);
shell.exec(`git add package.json package-lock.json`);
shell.exec(`git commit -m Bump version ${versionNumber}`);
shell.exec(`git push origin bump-version-${baseBranch}`);

console.log(chalk.green(`Pushed branch bump-version-${baseBranch}`));
