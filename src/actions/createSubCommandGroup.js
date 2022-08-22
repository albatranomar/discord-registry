import { ApplicationCommandOptionType } from 'discord.js';
import inquirer from 'inquirer';
import { createSubCommand } from './createSubCommand.js';

const _ = (s = '') => (' '.repeat(6) + s);

export async function createSubCommandGroup() {
    let subCommandGroupData = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: _("sub-command-group name:"),
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: _('sub-command-group description:'),
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

    let userAddingSubcommands = true;
    let Subcommands = [];
    console.warn(_('adding a sub command now: '));
    while (userAddingSubcommands) {
        let subCommandData = await createSubCommand();
        Subcommands.push(subCommandData);
        let { confirmation } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirmation',
            message: _('Do you want to add another sub command?'),
            default: false
        }]);
        userAddingSubcommands = confirmation;
    }
    return ({
        ...subCommandGroupData,
        options: Subcommands,
        type: ApplicationCommandOptionType.SubcommandGroup
    })
}