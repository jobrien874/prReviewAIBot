/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on(
    ["pull_request.opened", "pull_request.edited", "pull_request.reopened"],
    async (context) => {
  
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
