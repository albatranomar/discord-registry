import { ApplicationCommandType } from 'discord.js';
import inquirer from 'inquirer';
import { ask4MultiOptions } from '../common/ask4MultiOptions.js';

const UIMessage = `
        You can now provide us the command info.
`;

export async function ask4CommandInfo() {
    console.clear();

    let CommandInfo = await inquirer.prompt([
        {
            prefix: '',
            type: 'list',
            name: 'type',
            message: `${UIMessage}\nwhat type of commmand is that?`,
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
            message: "Command name:",
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid command name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Command description:',
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

    if (CommandInfo.type == ApplicationCommandType.ChatInput) {
        CommandInfo.options = await ask4MultiOptions('command', (options) => {
            console.clear();
            console.table({
                ...CommandInfo,
                options: options.map(o => o.name).join(',')
            });
        }, CommandInfo.name);
    }

    return CommandInfo;
}