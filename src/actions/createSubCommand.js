import { ApplicationCommandOptionType } from 'discord.js';
import inquirer from 'inquirer';
import { createOption } from './createOption.js';

const _ = (s = '') => (' '.repeat(6) + s);

export async function createSubCommand() {
    let subCommandData = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: _("sub-command name:"),
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid command name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: _('sub-command description:'),
            validate(value) {
                const pass = value.match(
                    /^.{1,100}$/i
                );
                if (pass) {
                    return true;
                }

                return _('Please enter a valid description');
            },
        }
    ]);
    return ({
        ...subCommandData,
        options: await createSubCommandOptions(),
        type: ApplicationCommandOptionType.Subcommand
    });
}

export async function createSubCommandOptions() {
    let subCommandData = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'options',
            message: _('Does this sub command have options?'),
            default: false
        },
    ]);

    if (subCommandData.options) {
        let userAddingOptions = true;
        let options = [];

        while (userAddingOptions) {
            let optionData = await createOption();
            options.push(optionData);
            let { confirmation } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirmation',
                message: _('Do you want to add another option?'),
                default: false
            }]);
            userAddingOptions = confirmation;
        }

        return options;

    } else {
        return [];
    }
}