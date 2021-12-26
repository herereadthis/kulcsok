const run = async ({github, context, core}) => {

  core.info('hello world');

  // const {SHA} = process.env
  // const commit = await github.rest.repos.getCommit({
  //   owner: context.repo.owner,
  //   repo: context.repo.repo,
  //   ref: `${SHA}`
  // })

  core.info('context');
  core.info(JSON.stringify(context));
  core.info('repo');
  core.info(JSON.stringify(context.repo));
  core.info('repos');
  core.info(JSON.stringify(context.repos));

  // core.exportVariable('author', commit.data.commit.author.email)
};


module.exports = run;