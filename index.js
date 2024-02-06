/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const Chat = require('./chat');

module.exports = (app) => {
  app.log.info("Loaded!");
  sentence = document.getElementById('sentence')

// The whole element have re-parsed
sentence.innerHTML += '<p> Hello world </p>'

  app.on(
    ["pull_request.opened", "pull_request.synchronize", "pull_request.edited", "pull_request.reopened"],
    async (context) => {
      const repositoryInfo = context.repo();
      const { base, head } = context.payload.pull_request;

      const data = await context.octokit.repos.compareCommits({
        owner: repositoryInfo.owner,
        repo: repositoryInfo.repo,
        base: base.sha,
        head: head.sha,
      });

      let { files: changedFiles, commits } = data.data;

      if (context.payload.action === 'synchronize') {
        const { data: { files } } = await context.octokit.repos.compareCommits({
          owner: repositoryInfo.owner,
          repo: repositoryInfo.repo,
          base: commits[commits.length - 2].sha,
          head: commits[commits.length - 1].sha,
        });

        const filesNames = files?.map((file) => file.filename) || [];
        changedFiles = changedFiles?.filter((file) => filesNames.includes(file.filename));

        app.log.info(`${filesNames.length} files being checked`);

        await Promise.all(changedFiles.map(async (file) => {
          const { status, patch, filename } = file;

          if (status === 'modified' || status === 'added') {
            if (patch && patch.length <= 1000) {
              try {
                const ChatGPTAPI = new Chat(process.env.OPEN_AI_API_KEY);
                const res = await ChatGPTAPI.askQuestion(patch);

                if (!!res) {
                  await context.octokit.pulls.createReviewComment({
                    repo: repositoryInfo.repo,
                    owner: repositoryInfo.owner,
                    pull_number: context.payload.pull_request.number,
                    commit_id: commits[commits.length - 1].sha,
                    path: filename,
                    body: res,
                    position: patch.split('\n').length - 1,
                  });
                }
              } catch (e) {
                console.error(`Failed to review`, e);
              }
            }
          }

          try {
            const ChatGPTAPI = new Chat(process.env.OPEN_AI_API_KEY);
            const res = await ChatGPTAPI.askQuestion(patch);

            if (!!res) {
              const reviewComment = {
                repo: repositoryInfo.repo,
                owner: repositoryInfo.owner,
                pull_number: context.payload.pull_request.number,
                commit_id: commits[commits.length - 1].sha,
                path: filename,
                body: res,
                position: patch.split('\n').length - 1,
              };

              await context.octokit.pulls.createReviewComment(reviewComment);
            }
          } catch (e) {
            console.error(`Failed to review`, e);
          }
        }));
      }
    }
  );

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
