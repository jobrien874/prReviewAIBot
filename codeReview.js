Config = require('./config');

export const createPromptForGpt = (file) => {
    const config = new Config();
    const prompt = "Here is a code change, please help me by doing a code review of it. Any ";
    let asksConfig = '';
    const closingStatement = " would be much appreciated:"
    console.log(config)
    Object.entries(config).forEach(([key, value]) => {
        if (value === false) return;
        switch (key) {
            case "bugs":
                asksConfig += 'bug risks or issues you can flag, ';

            case "bestPractices":
                asksConfig += 'best practices or suggestions you can flag, ';
                break;

            case "security":
                asksConfig += 'security risks or problems you can identify, ';
                break;

            case "improvements":
                asksConfig += 'improvements to the code or how its written you can suggest, ';
                break;

            case "accessibility":
                asksConfig += 'accessibility improvements or suggestions you can make, ';
                break;
            default:
                // code for default case
                asksConfig += 'improvement or suggestions are welcome:'
                break;
        }
    });
    return prompt + asksConfig + closingStatement + file;
}