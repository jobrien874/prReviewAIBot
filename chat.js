import { ChatGPTAPI } from 'chatgpt';
import { createPromptForGpt } from './codeReview';
import { Chat } from './chat';

module.exports = class Chat {
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
    const response = await getResponse(prompt);
    return response?.text;
  }
}