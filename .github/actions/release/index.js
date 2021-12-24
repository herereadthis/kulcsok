const core = require('@actions/core');
const {
    GitHub,
    context
} = require('@actions/github');
const shell = require('shelljs');
const simpleGit = require('simple-git');
const semver = require('semver');

const git = simpleGit();

// Action inputs

const RELEASE_BRANCH = core.getInput('release_branch');
const CREATE_PROD_BUILD = core.getInput('create_prod_build') === 'true';



const getCurrentVersion = () => {
    const currentVersion = shell.exec(`echo $(node -p -e "require('./package.json').version")`);
    return currentVersion.stdout;
};


const run = async () => {
    try {
        // Get authenticated GitHub client (Ocktokit): 
        // https://github.com/actions/toolkit/tree/master/packages/github#usage
        const github = new GitHub(process.env.GITHUB_TOKEN);

        await git
            .addConfig('user.email', 'github-actions')
            .addConfig('user.name', 'github-actions@github.com');

        const {
            owner: currentOwner,
            repo: currentRepo
        } = context.repo;

        const version = getCurrentVersion();
        const tag = `v${version}`;
        const prerelease = CREATE_PROD_BUILD === false;

        core.warning(currentOwner);
        core.warning(currentRepo);
        core.warning(tag);
        core.warning(prerelease);


        core.setOutput("version", version);
    } catch (err) {
        core.setFailed(err.message);
    }
}


run();