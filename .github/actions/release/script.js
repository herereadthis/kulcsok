const run = async ({github, context, core}) => {

    core.info('hello world');

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

    core.info('process.env')
    core.info(JSON.stringify(process.env))
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

    // octokit.rest.repos.createRelease({
    //     owner,
    //     repo,
    //     tag_name,
    //   });

    // core.exportVariable('author', commit.data.commit.author.email)
};


module.exports = run;