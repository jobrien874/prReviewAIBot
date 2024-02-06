const Config = require('./config');
const createPromptForGpt = (file) => {
    const config = new Config();
    const prompt = "Here is a code change, please help me by doing a code review of it. Any ";
    let asksConfig = '';
    const closingStatement = " would be much appreciated:"
    let promptOptions = '';
    Object.entries(config).forEach(([key, value]) => {
        promptOptions += `${key},\n`;
        if (value === false) return;
        switch (key) {
            case "bugs":
                asksConfig += 'bug risks or issues you can flag, ';
                break;

            case "bestPractices":
                asksConfig += 'best practices or suggestions you can flag, ';
                break;

            case "security":
                asksConfig += 'security risks or problems you can identify, ';
                break;

            case "improvements":
                asksConfig += 'improvements to the code or how it\'s written you can suggest, ';
                break;

            case "accessibility":
                asksConfig += 'accessibility improvements or suggestions you can make, ';
                break;

            default:
                asksConfig += 'improvement or suggestions are welcome - Please keep your answer in a numbered list format - with the relevant titles :' + promptOptions;
                break;
        }
    });
    return prompt + asksConfig + closingStatement + file;
}

module.exports = { createPromptForGpt };