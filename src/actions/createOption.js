import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import inquirer from 'inquirer';
import { createSubCommand } from './createSubCommand.js';
import { createSubCommandGroup } from './createSubCommandGroup.js';
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

const _ = (s = '') => (' '.repeat(4) + s);

export async function getNormalOptionSettings(type) {
    let normalOptionSettings = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: _("option name:"),
            validate(value) {
                return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(value.trim()) ? true : 'Please enter a valid command name';
            },
        },
        {
            type: 'input',
            name: 'description',
            message: _('option description:'),
            validate(value) {
                const pass = value.match(
                    /^.{1,100}$/i
                );
                if (pass) {
                    return true;
                }

                return _('Please enter a valid description');
            },
        },
        {
            type: 'confirm',
            name: 'required',
            message: _('is that option required?'),
            default: false,
        },
        {
            type: 'confirm',
            name: 'autocomplete',
            message: _('this option accept an autocomplete event?'),
            when() {
                return ([
                    ApplicationCommandOptionType.String,
                    ApplicationCommandOptionType.Integer,
                    ApplicationCommandOptionType.Number
                ].includes(type)) ? true : false;
            },
            default: false
        },
        {
            type: 'input',
            name: 'choices',
            message: _(`if this option have choices you can provide them with ',' between each choice.`),
            default: [''],
            when(answers) {
                return ([
                    ApplicationCommandOptionType.String,
                    ApplicationCommandOptionType.Integer,
                    ApplicationCommandOptionType.Number
                ].includes(type) && !answers.autocomplete) ? true : false;
            },
            /**
             * 
             * @param {string} input 
             * @returns 
             */
            validate(input) {
                return (input.split(',').length > 25) ? _('Invalid choices count. (max 25 choices)') : true
            },
            filter(input) {
                return input.split(',');
            }
        },
        {
            type: 'checkbox',
            name: 'channel_types',
            message: _('select channel types of this option:'),
            choices: ChannelTypes.map(typeo => {
                return {
                    key: typeo.name,
                    name: typeo.name,
                    value: typeo.id
                }
            }),
            default: ChannelTypes.map(t => t.id),
            when() {
                return (type == ApplicationCommandOptionType.Channel) ? true : false
            }
        }]);

    return normalOptionSettings;
}

export async function createOption() {
    let data = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: _('what type of options is that?'),
            choices: OptionTypes
                .filter(t => ![ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(t.id))
                .map(typeo => {
                    return {
                        key: typeo.name,
                        name: typeo.name,
                        value: typeo.id
                    }
                })
        }
    ]);

    return ({
        ...data,
        ...(await getNormalOptionSettings(data.type))
    })
}

export async function chooseOptionType() {
    let optionData = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: _('what type of options is that?'),
            choices: OptionTypes.map(typeo => {
                return {
                    key: typeo.name,
                    name: typeo.name,
                    value: typeo.id
                }
            })
        }
    ]);

    if (![ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(optionData.type)) {
        return ({
            ...optionData,
            ...(await getNormalOptionSettings(optionData.type))
        })
    } else if (ApplicationCommandOptionType.Subcommand == optionData.type) {
        return ({
            ...optionData,
            ...(await createSubCommand())
        })
    } else if (ApplicationCommandOptionType.SubcommandGroup == optionData.type) {
        return ({
            ...optionData,
            ...(await createSubCommandGroup())
        })
    }

    return optionData;
}