import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import inquirer from 'inquirer';
const OptionTypes = [];
const ChannelTypes = [];

for (const [propertyKey, propertyValue] of Object.entries(ApplicationCommandOptionType)) {
    if (Number.isNaN(Number(propertyKey))) {
        OptionTypes.push({ id: propertyValue, name: propertyKey });
    }
}
for (const [propertyKey, propertyValue] of Object.entries(ChannelType)) {
    if (Number.isNaN(Number(propertyKey))) {
        ChannelTypes.push({ id: propertyValue, name: propertyKey });
    }
}

export async function ask4OptionData() {
    let OptionData = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'Option Type:',
            choices: OptionTypes
                .filter(t => ![ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(t.id))
                .map(typeo => {
                    return {
                        name: typeo.name,
                        value: typeo.id
                    }
                })
        },
        {
            type: 'input',
            name: 'name',
            message: "Option name:",
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid command name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Option description:',
            validate(value) {
                const pass = value.match(
                    /^.{1,100}$/i
                );
                if (pass) {
                    return true;
                }

                return 'Please enter a valid description';
            },
        },
        {
            type: 'confirm',
            name: 'required',
            message: 'is that option required?',
            default: false,
        },
        {
            type: 'confirm',
            name: 'autocomplete',
            message: 'this option accept an autocomplete event?',
            when(a) {
                return ([
                    ApplicationCommandOptionType.String,
                    ApplicationCommandOptionType.Integer,
                    ApplicationCommandOptionType.Number
                ].includes(a.type));
            },
            default: false
        },
        {
            type: 'input',
            name: 'choices',
            message: `if this option have choices you can provide them with ',' between each choice.`,
            default: '',
            when(answers) {
                return ([
                    ApplicationCommandOptionType.String,
                    ApplicationCommandOptionType.Integer,
                    ApplicationCommandOptionType.Number
                ].includes(answers.type) && !answers.autocomplete);
            },
            filter(input) {
                let choices = input.split(',');
                if (choices.length == 1 && choices[0] == '') {
                    return undefined;
                } else {
                    return choices.map(c => c.trim());
                }
            },
            validate(input) {
                return (input && input.length > 25) ? 'Invalid choices count. (max 25 choices)' : true;
            }
        },
        {
            type: 'checkbox',
            name: 'channel_types',
            message: 'select channel types of this option:',
            choices: ChannelTypes.map(typeo => {
                return {
                    key: typeo.name,
                    name: typeo.name,
                    value: typeo.id
                }
            }),
            default: [],
            when(a) {
                return (a.type == ApplicationCommandOptionType.Channel);
            }
        }]);

    return OptionData;
}