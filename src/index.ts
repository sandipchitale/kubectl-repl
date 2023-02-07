import * as readline from 'readline'
import * as child_process from 'child_process';
(async ()=> {
    const kubectlPrompt = readline.createInterface({
        prompt: '> kubectl ',
        historySize: 1000,
        input: process.stdin,
        output: process.stdout,
    });
    let history = [];
    let commandNumber = 1;
    kubectlPrompt.setPrompt(`${commandNumber} > kubectl `);
    kubectlPrompt.prompt();
    kubectlPrompt.on('line', command => {
        command = command.trim();
        if (command === 'exit') {
            kubectlPrompt.close();
            return;
        }
        if (command === 'history') {
            history.forEach((command: string) => {
                console.log(command);
            });
            kubectlPrompt.prompt();
            return;
        } else if (command.match(/^!\d+$/)) {
            const matches = command.match(/^!(\d+)$/);
            command = undefined;
            if (matches && matches.length === 2) {
                try {
                    const commandNumber = parseInt(matches[1]);
                    const historyCommand = history.find(historyItem => historyItem.startsWith(`${commandNumber} >`));
                    if (historyCommand) {
                        console.log(`${historyCommand}\n`);
                        command = historyCommand.replace(`${commandNumber} > kubectl `, '');
                    }
                } catch (error: any) {
                }
            }
        }

        try {
            if (command !== undefined) {
                try {
                    history.push(`${commandNumber} > kubectl ${command}`);
                    const commandResult = child_process.execSync(`kubectl ${command}`, { encoding: 'utf8' });
                    if (commandResult) {
                        console.log(commandResult);
                    }
                } catch (error: any) {
                    console.error(error.stderr);
                }
            }
        } finally {
            commandNumber++;
            kubectlPrompt.setPrompt(`${commandNumber} > kubectl `);
            kubectlPrompt.prompt();
        }
    });
})();
