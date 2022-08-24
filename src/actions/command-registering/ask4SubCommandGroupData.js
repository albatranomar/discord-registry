import 'colors';
import { ApplicationCommandOptionType } from 'discord.js';
import inquirer from 'inquirer';
import { ask4MultiOptions } from '../common/ask4MultiOptions.js';

export async function ask4SubCommandGroupData(parent) {
    let subCommandGroupInfo = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Sub-Command-Group Name:",
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid sub command group name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Sub-Command-Group Description:',
            validate(value) {
                const pass = value.match(
                    /^.{1,100}$/i
                );
                if (pass) {
                    return true;
                }

                return 'Please enter a valid sub command group description';
            },
        }
    ]);

    subCommandGroupInfo.options = await ask4MultiOptions('sub-command-group', (options) => {
        console.clear();
        console.log(`This is a sub command group for ${parent}`.bgGreen.black);
        console.table({
            ...subCommandGroupInfo,
            sub_commands: options.map(o => o.name).join(',')
        });
    }, `${parent}->${subCommandGroupInfo.name}`);

    subCommandGroupInfo.type = ApplicationCommandOptionType.SubcommandGroup;

    return subCommandGroupInfo;
}