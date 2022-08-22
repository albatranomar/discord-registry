import { ApplicationCommandType } from 'discord.js';
import inquirer from 'inquirer';
import { chooseOptionType } from './createOption.js';

const _ = (s = '') => (' '.repeat(2) + s);

export async function createCommand() {
    let commandData = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: _('what type of commmand is that?'),
            choices: [
                {
                    key: 'chat_input',
                    name: 'Slash Command (CHAT INPUT)',
                    value: ApplicationCommandType.ChatInput
                },
                {
                    key: 'user_contextmenu',
                    name: 'User Context Menu',
                    value: ApplicationCommandType.User
                },
                {
                    key: 'message_contextmenu',
                    name: 'Message Context Menu',
                    value: ApplicationCommandType.Message
                }
            ]
        },
        {
            type: 'input',
            name: 'name',
            message: _("What's the name of this command?"),
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid command name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: _('Now provide a description for this command:'),
            when(answers) {
                return (answers.type == ApplicationCommandType.ChatInput) ? true : false;
            },
            validate(value) {
                const pass = value.match(
                    /^.{1,100}$/i
                );
                if (pass) {
                    return true;
                }

                return _('Please enter a valid command description');
            },
        },
        {
            type: 'confirm',
            name: 'dm_permission',
            message: _('is that command available in dms?'),
            default: true
        },
        {
            type: 'confirm',
            name: 'options',
            message: _('Does this command have options?'),
            when(answers) {
                return (answers.type == ApplicationCommandType.ChatInput) ? true : false;
            },
            default: false
        },
    ]);

    if (commandData.options) {
        let userAddingOptions = true;
        let options = [];

        while (userAddingOptions) {
            let optionData = await chooseOptionType();
            options.push(optionData);
            let { confirmation } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirmation',
                message: _('Do you want to add another option?'),
                default: false
            }]);
            userAddingOptions = confirmation;
        }

        return ({
            ...commandData,
            options
        })

    }
    return commandData;
}