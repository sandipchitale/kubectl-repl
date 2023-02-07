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
        }

        try {
            try {
                history.push(`${commandNumber} > kubectl ${command}`);
                const commandResult = child_process.execSync(`kubectl ${command}`, { encoding: 'utf8' });
                if (commandResult) {
                    console.log(commandResult);
                }
            } catch (error: any) {
                console.error(error.stderr);
            }
        } finally {
            commandNumber++;
            kubectlPrompt.setPrompt(`${commandNumber} > kubectl `);
            kubectlPrompt.prompt();
        }
    });
})();
