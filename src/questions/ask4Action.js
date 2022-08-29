import inquirer from 'inquirer';

export async function ask4CommandInfo() {
    return await inquirer.prompt([
        {
            prefix: '',
            type: 'list',
            name: 'action',
            message: `${WelcomeMessage}\nWhat do you want to do now?`,
            choices: ['Add a new commmand', 'Edit an existing command', 'Delete a command from your bot registry', 'Delete all commands from your bot registry']
        }
    ]);
}