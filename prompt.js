const Config = require('./config');
const config = new Config();

const createPromptForGpt = (file) => {
    const prompt = "Here is a code change, please help me by doing a code review of it. Any ";
    let asksConfig = [];
    const closingStatement = " would be much appreciated:"
    let promptOptions = [];
    
    Object.entries(config).forEach(([key, value]) => {
        promptOptions.push(`${key},\n`);
        if (value === false) return;
        switch (key) {
            case "bugs":
                asksConfig.push('bug risks or issues you can flag, ');
                break;

            case "bestPractices":
                asksConfig.push('best practices or suggestions you can flag, ');
                break;

            case "security":
                asksConfig.push('security risks or problems you can identify, ');
                break;

            case "improvements":
                asksConfig.push('improvements to the code or how it\'s written you can suggest, ');
                break;

            case "accessibility":
                asksConfig.push('accessibility improvements or suggestions you can make, ');
                break;

            default:
                asksConfig.push('improvement or suggestions are welcome - Please keep your answer in a numbered list format - with the relevant titles and please dont mention line numbers, more discuss the edit/file as a whole :' + promptOptions.join(''));
                break;
        }
    });
    
    return prompt + asksConfig.join('') + closingStatement + file;
}

module.exports = { createPromptForGpt };