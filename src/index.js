import 'colors';
import inquirer from 'inquirer';
import { ask4CommandInfo } from './actions/command-registering/ask4CommandInfo.js';

const WelcomeMessage = `
        ${'Hello There 👋'.green}. ${'Welcome to Slash Commands Cli.'.gray}
`;

inquirer.prompt([
    {
        prefix: '',
        type: 'list',
        name: 'action',
        message: `${WelcomeMessage}\nWhat do you want to do now?`,
        choices: ['Register a new command', 'edit a command', 'delete a command', 'complix registring']
    }
]).then(async (answers) => {
    console.clear();
    if (answers.action == 'Register a new command') {
        let commandData = await ask4CommandInfo();
        console.log(JSON.stringify(commandData, null, 2));
    }
});