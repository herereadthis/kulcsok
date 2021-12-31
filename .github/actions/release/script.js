const shell = require('shelljs');

const getBody = (sha, commitMessage, branch) => {
    return `
* SHA: ${sha}
* Commit message: \`${commitMessage}\`
* Branch: \`${branch}\`
    `;
}

const run = async ({github, context, core}) => {
    try {
        const currentVersion = shell.exec(`echo $(node -p -e "require('./package.json').version")`);
        const version = currentVersion.stdout.toString().replace(/\s+/g, '');

        const {
            owner,
            repo
        } = context.repo;

        const {branch} = process.env;
        const createProductionRelease = process.env.create_prod_release === 'true';

        const commits = await github.rest.repos.listCommits({
            owner,
            repo,
            per_page: 1,
            sha: branch
        });

        const {
            sha,
            commit
        } = commits.data[0];

        let prerelease, name, tag_name;
        if (createProductionRelease) {
            prerelease = false;
            name = `${version} Production`;
            tag_name = `v${version}-prod`;
        } else {
            prerelease = true;
            name = `${version} Staging`;
            tag_name = `v${version}-staging`;
        }

        await github.rest.repos.createRelease({
            owner,
            repo,
            tag_name,
            target_commitish: sha,
            name,
            body: getBody(sha, commit.message, branch),
            prerelease
        });
    } catch (err) {
        core.setFailed(err.message);
        throw err;
    }
};


module.exports = run;