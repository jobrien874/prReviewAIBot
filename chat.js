const { createPromptForGpt } = require('./codeReview');

module.exports = class Chat {
  constructor(key) {
    this.key = key; 
  }

  async getResponse(prompt) {
    return await import('chatgpt').then(ChatGPTAPI => {
      const chatGPTAPI = new ChatGPTAPI({ apiKey: this.key, apiBaseUrl: 'https://api.openai.com/v1' });
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