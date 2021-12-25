module.exports = async ({github, context, core}) => {

    core.info('hello world');
    
    const {SHA} = process.env
    const commit = await github.rest.repos.getCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: `${SHA}`
    })
    core.exportVariable('author', commit.data.commit.author.email)
  }