import { ChatGPTAPI } from 'chatgpt';

export class Chat {
  constructor(key) {
    this.chatGPTAPI = new ChatGPTAPI({ apiKey: key, apiBaseUrl: 'https://api.openai.com/v1' });
  }

  async getResponse(prompt) {
    return await this.chatGPTAPI.sendMessage(prompt);
  }

  askQuestion = async (prompt) => {
    const response = await getResponse(prompt);
    return response?.text;
  }
}