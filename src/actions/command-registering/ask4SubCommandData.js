import 'colors';
import { ApplicationCommandOptionType } from 'discord.js';
import inquirer from 'inquirer';
import { ask4MultiOptions } from '../common/ask4MultiOptions.js';

export async function ask4SubCommandData(parent) {
    let subCommandInfo = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Sub-Command Name:",
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid sub command name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Sub-Command Description:',
            validate(value) {
                const pass = value.match(
                    /^.{1,100}$/i
                );
                if (pass) {
                    return true;
                }

                return 'Please enter a valid sub command description';
            },
        }
    ]);

    subCommandInfo.options = await ask4MultiOptions('sub-command', (options) => {
        console.clear();
        console.log(`This is a sub command for ${parent}`.bgGreen.black);
        console.table({
            ...subCommandInfo,
            options: options.map(o => o.name).join(',')
        });
    }, `${parent}->${subCommandInfo.name}`);

    subCommandInfo.type = ApplicationCommandOptionType.Subcommand;

    return subCommandInfo;
}