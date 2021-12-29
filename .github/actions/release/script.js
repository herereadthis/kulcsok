const exec = require('@actions/exec');
const shell = require('shelljs');

const getBody = (sha, url, message, branch) => {
    return `
SHA: ${sha}
URL: [${message}](${url})
    `;
}

const run = async ({github, context, core}) => {
    core.info('hello world');
    try {
        await exec.exec('ls');

        const currentVersion = shell.exec(`echo $(node -p -e "require('./package.json').version")`);

        // const {SHA} = process.env
        // const commit = await github.rest.repos.getCommit({
        //   owner: context.repo.owner,
        //   repo: context.repo.repo,
        //   ref: `${SHA}`
        // })

        const {
            owner,
            repo
        } = context.repo;

        const {
            branch,
            create_prod_build: createProductionBuild
        } = process.env;

        core.info('currentVersion')
        core.info(currentVersion)
        core.info('createProductionBuild')
        core.info(createProductionBuild)
        core.info('github')
        core.info(JSON.stringify(github))
        core.info('context');
        core.info(JSON.stringify(context));
        core.info('repo');
        core.info(JSON.stringify(context.repo));
        core.info('repos');
        core.info(JSON.stringify(context.repos));

        const commits = await github.rest.repos.listCommits({
            owner,
            repo,
            per_page: 1
        });

        const {
            html_url,
            sha,
            commit
        } = commits.data[0];

        core.info('sha');
        core.info(sha);
        core.info('html_url');
        core.info(html_url);
        core.info('commit.message');
        core.info(commit.message);

        await github.rest.repos.listCommits({
            owner,
            repo,
            target_commitish: sha,
            name: createProductionBuild ? `${currentVersion} Production` : `${currentVersion} Staging`,
            body: getBody(sha, html_url, commit.mesage, branch),
            prerelease: !createProductionBuild
        });
    } catch (err) {
        core.setFailed(err.message);
        throw err;
    }
};


module.exports = run;