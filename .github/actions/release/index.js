const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const shell = require('shelljs');
const simpleGit = require('simple-git');

const git = simpleGit();

// Action inputs

const RELEASE_BRANCH = core.getInput('release_branch');
const CREATE_PROD_BUILD = core.getInput('create_prod_build') === 'true';



const getCurrentVersion = () => {
    const currentVersion = shell.exec(`echo $(node -p -e "require('./package.json').version")`);
    return currentVersion.stdout;
};


const run = async () => {
    core.info(1);
    try {
        // Get authenticated GitHub client (Ocktokit): 
        // https://github.com/actions/toolkit/tree/master/packages/github#usage
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
        const github = new GitHub(process.env.GITHUB_TOKEN);

        core.warning(2);
        await git
            .addConfig('user.email', 'github-actions')
            .addConfig('user.name', 'github-actions@github.com');

        core.warning(3);
        const {
            owner: currentOwner,
            repo: currentRepo
        } = context;


        core.warning(4);

        const version = getCurrentVersion();
        const tag = `v${version}`;
        const prerelease = CREATE_PROD_BUILD === false;
        core.warning(5);

        core.warning('can you see me?');
        core.warning(version);
        core.warning(prerelease);
        core.warning(tag);
        core.warning(currentOwner);
        core.warning(currentRepo);

        core.warning(7);
        
        
        core.setOutput("version", version);
        core.setOutput("tag", tag);
        core.setOutput("owner", currentOwner);
        core.setOutput("repo", currentRepo);
        core.warning(7);
    } catch (err) {
        core.setFailed(err.message);
    }
}


run();