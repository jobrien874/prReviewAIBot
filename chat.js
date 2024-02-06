const { createPromptForGpt } = require('./codeReview');

const { Chat } = require('./chat');
const ChatGPTAPI = require('chatgpt');
export class Chat {
  constructor(key) {
    this.chatGPTAPI = new ChatGPTAPI({ apiKey: key, apiBaseUrl: 'https://api.openai.com/v1' });
  }

  async getResponse(prompt) {
    return await this.chatGPTAPI.sendMessage(prompt);
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