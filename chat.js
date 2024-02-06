const { createPromptForGpt } = require('./codeReview');

module.exports = class Chat {
  constructor(key) 

  async getResponse(prompt) {
    const { ChatGPTAPI} = await import('chatgpt');
    const chatGPTAPI =  new ChatGPTAPI({ apiKey: this.key, apiBaseUrl: 'https://api.openai.com/v1' });
    console.log(chatGPTAPI)
    return chatGPTAPI.sendMessage(prompt);
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