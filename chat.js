const { createPromptForGpt } = require('./codeReview');

module.exports = class Chat {
  constructor(key) {
    this.chatGPTAPI = new ChatGPTAPI({ apiKey: key, apiBaseUrl: 'https://api.openai.com/v1' });
  }

  async getResponse(prompt) {
    return await import('chatgpt').then(ChatGPTAPI => {
      const chatGPTAPI = new ChatGPTAPI.default({ apiKey: key, apiBaseUrl: 'https://api.openai.com/v1' });
      return chatGPTAPI.sendMessage(prompt);
    });
  }

  askQuestion = async (file) => {
    if (!file) {
      return;
    }
    const prompt = createPromptForGpt(file);
    const response = await this.getResponse(prompt);
    return response?.text;
  }
}