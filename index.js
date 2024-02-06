/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const { Chat } = require('./chat');


module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded! asdjcjnjncjnjnjn");

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

      if (context.payload.action === 'synchronize') {
        const {
          data: { files },
        } = await context.octokit.repos.compareCommits({
          owner: respositoryInfo.owner,
          repo: respositoryInfo.repo,
          base: commits[commits.length - 2].sha,
          head: commits[commits.length - 1].sha,
        });

        
        const filesNames = files?.map((file) => file.filename) || [];
        changedFiles = changedFiles?.filter(
          (file) =>
            filesNames.includes(file.filename)
        );

        app.log.info("reached here 2");

        app.log.info(filesNames);

        for (let i = 0; i < changedFiles.length; i++) {
          const file = changedFiles[i];
          const patch = file.patch || '';
  
          if (file.status !== 'modified' && file.status !== 'added') {
            continue;
          }
  
          if (!patch || patch.length > 100) {
            console.log(
              `${patch.length} skipped caused by its diff is too large`
            );
            continue;
          }
          try {
            const ChatGPTAPI = new Chat({ apiKey: process.env.OPEN_AI_API_KEY, apiBaseUrl: 'https://api.openai.com/v1' });
            const res = await ChatGPTAPI.askQuestion(patch);
  
            if (!!res) {
              await context.octokit.pulls.createReviewComment({
                repo: repo.repo,
                owner: repo.owner,
                pull_number: context.pullRequest().pull_number,
                commit_id: commits[commits.length - 1].sha,
                path: file.filename,
                body: res,
                position: patch.split('\n').length - 1,
              });
            }
          } catch (e) {
            console.error(`review ${file.filename} failed`, e);
          }
        }

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
