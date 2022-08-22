import inquirer from 'inquirer';
import { createCommand } from './actions/createCommand.js';

inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What do you want to do now?',
        choices: ['register a new command', 'edit a command', 'delete a command', 'complix registring']
    }
]).then(async (answers) => {
    if (answers.action == 'register a new command') {
        let commandData = await createCommand();
        console.log(JSON.stringify(commandData, null, 2));
    }
});