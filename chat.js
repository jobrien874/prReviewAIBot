const { createPromptForGpt } = require('./codeReview');
const { ChatGPTAPI } = require('chatgpt');
module.exports = class Chat {
  constructor(key) {
    this.key = key; 
    this.chatGPTAPI = new ChatGPTAPI({ apiKey: this.key, apiBaseUrl: 'https://api.openai.com/v1' });
  }

  async getResponse(prompt) {
    return this.chatGPTAPI.sendMessage(prompt);
  }

  async askQuestion(file) {
    if (!file) {
      return;
    }
    const prompt = createPromptForGpt(file);
    const response = await this.getResponse(prompt);
    return response?.text;
  }
}