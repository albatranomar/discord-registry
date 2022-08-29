import { ApplicationCommandType } from 'discord.js';
import inquirer from 'inquirer';

export async function ask4CommandInfo() {
    let CommandInfo = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: `what type of commmand is that?`,
            choices: [
                {
                    name: 'Slash Command (CHAT INPUT)',
                    value: ApplicationCommandType.ChatInput
                },
                {
                    name: 'User Context Menu',
                    value: ApplicationCommandType.User
                },
                {
                    name: 'Message Context Menu',
                    value: ApplicationCommandType.Message
                }
            ]
        },
        {
            type: 'input',
            name: 'name',
            validate(value, answers) {
                if (answers.type == ApplicationCommandType.ChatInput) {
                    return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim())
                        ? true
                        : 'Please enter a valid command name';
                }
                return true
            },
        },
        {
            type: 'input',
            name: 'description',
            when(answers) {
                return (answers.type == ApplicationCommandType.ChatInput) ? true : false;
            },
            validate(value) {
                const pass = value.match(/^.{1,100}$/i);
                if (pass) {
                    return true;
                }
                return 'Please enter a valid command description';
            },
        },
        {
            type: 'confirm',
            name: 'dm_permission',
            message: 'is that command available in dms?',
            default: true
        },
    ]);

    return CommandInfo;
}