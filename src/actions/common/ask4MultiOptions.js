import inquirer from 'inquirer';
import { ask4OptionData } from '../command-registering/ask4OptionData.js';
import { ask4SubCommandData } from '../command-registering/ask4SubCommandData.js';
import { ask4SubCommandGroupData } from '../command-registering/ask4SubCommandGroupData.js';

export async function ask4MultiOptions(addTo, callOnEveryOptionAsk, parent) {
    let option_types = [];
    if (addTo == 'command') {
        option_types.push({
            name: 'Noraml Option',
            value: 'option'
        });
        option_types.push({
            name: 'Sub Command',
            value: 'sub-command'
        });
        option_types.push({
            name: 'Sub Command Group',
            value: 'sub-command-group'
        });
    } else if (addTo == 'sub-command') {
        option_types.push({
            name: 'Noraml Option',
            value: 'option'
        });
    } else if (addTo == 'sub-command-group') {
        option_types.push({
            name: 'Sub Command',
            value: 'sub-command'
        });
    }
    let options = [];
    let firstTime = true;
    let addMore = true;
    while (addMore) {
        await callOnEveryOptionAsk(options);
        let Asking4Options = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'add_more',
                message() {
                    if (firstTime) {
                        firstTime = false;
                        return `Do you want to add an option to this ${addTo}?`
                    } else {
                        return `Do you want to add another option to this ${addTo}?`
                    }
                },
                default: false
            },
            {
                type: 'list',
                name: 'option_type',
                message: `${addTo} Options`,
                choices: option_types,
                when: a => {
                    addMore = a.add_more;
                    return a.add_more;
                }
            }
        ]);

        switch (Asking4Options.option_type) {
            case 'option':
                options.push(await ask4OptionData());
                break;
            case 'sub-command':
                options.push(await ask4SubCommandData(parent));
                break;
            case 'sub-command-group':
                options.push(await ask4SubCommandGroupData(parent));
                break;

            default:
                break;
        }
    }
    return options;
}