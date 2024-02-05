/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
import { Chat } from './chat.js';

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on(
    ["pull_request.opened", "pull_request.synchronize"],
    async (context) => {
      const respositoryInfo = context.repo();

      const data = await context.octokit.repos.compareCommits({
        owner: respositoryInfo.owner,
        repo: respositoryInfo.repo,
        base: context.payload.pull_request.base.sha,
        head: context.payload.pull_request.head.sha,
      });

      app.log.info(data, 'hello this is a test');

      let { files: changedFiles, commits } = data.data;
  
      if (context.payload.pull_request.title.indexOf('🤖') > -1) {
        await context.octokit.pulls.createReviewComment({
          repo: respositoryInfo.repo,
          owner: respositoryInfo.owner,
          pull_number: context.pullRequest().pull_number,
          commit_id: commits[commits.length - 1].sha,
          path: file.filename,
          body: res,
          position: patch.split('\n').length - 1,
        });
      }
    }
  );

  

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
