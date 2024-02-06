const { createPromptForGpt } = require('./codeReview');

module.exports = class Chat {
  constructor(key) {
    this.chatGPTAPI = new ChatGPTAPI({ apiKey: key, apiBaseUrl: 'https://api.openai.com/v1' });


  askQuestion = async (file) => {
    if (!file) {
      return;
    }
    const prompt = createPromptForGpt(file);
    const response = await this.getResponse(prompt);
    return response?.text;
  }
}