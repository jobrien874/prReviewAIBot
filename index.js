/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
// import { Chat } from './chat.js';

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on(
    ["pull_request.opened", "pull_request.synchronize", "pull_request.edited", "pull_request.reopened"],
    async (context) => {
      const respositoryInfo = context.repo();

      const data = await context.octokit.repos.compareCommits({
        owner: respositoryInfo.owner,
        repo: respositoryInfo.repo,
        base: context.payload.pull_request.base.sha,
        head: context.payload.pull_request.head.sha,
      });

      let { files: changedFiles, commits } = data.data;

      if (context.payload.action === 'synchronize' && commits.length >= 2) {
        const {
          data: { files },
        } = await context.octokit.repos.compareCommits({
          owner: repo.owner,
          repo: repo.repo,
          base: commits[commits.length - 2].sha,
          head: commits[commits.length - 1].sha,
        });

        
        const filesNames = files?.map((file) => file.filename) || [];
        changedFiles = changedFiles?.filter(
          (file) =>
            filesNames.includes(file.filename) &&
            !ignoreList.includes(file.filename)
        );


        app.log.info(filesNames);
      }
  
      if (context.payload.pull_request.title.indexOf('🤖') > -1) {
        await context.octokit.pulls.createReview({
          ...context.pullRequest(),
          event: 'APPROVE'
        })
      }
    }
  );

  

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
