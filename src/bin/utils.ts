import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { writeFileSync } from "fs";
import path from "path";

const discord_registry_path = path.resolve(process.cwd(), 'discord-registry');

export function createJSCommand(command: RESTPostAPIApplicationCommandsJSONBody) {
    const jsCommandTemplate = `const { RESTPostAPIApplicationCommandsJSONBody,
    ApplicationCommandType,
    ApplicationCommandOptionType } = require('discord-api-types/v10');

/**
 * @type {RESTPostAPIApplicationCommandsJSONBody}
 */
module.exports = {{command_info}}
`;

    writeFileSync(
        path.resolve(discord_registry_path, 'commands', `${command.name}.js`),
        jsCommandTemplate.replace('{{command_info}}', JSON.stringify(
            {
                ...command,
                application_id: undefined,
                version: undefined,
            }, null, 4
        ).replace(/"(\w+)"\s*:/g, '$1:')
        )
        ,
        {
            encoding: 'utf-8',
        }
    );
}

export function createTSCommand(command: RESTPostAPIApplicationCommandsJSONBody) {
    const jsCommandTemplate = `import {
    RESTPostAPIApplicationCommandsJSONBody,
    ApplicationCommandType,
    ApplicationCommandOptionType 
} from 'discord-api-types/v10';

 export default {{command_info}} as RESTPostAPIApplicationCommandsJSONBody
`;

    writeFileSync(
        path.resolve(discord_registry_path, 'commands', `${command.name}.ts`),
        jsCommandTemplate.replace('{{command_info}}', JSON.stringify(
            {
                ...command,
                application_id: undefined,
                version: undefined,
            }, null, 4
        ).replace(/"(\w+)"\s*:/g, '$1:')
        )
        ,
        {
            encoding: 'utf-8',
        }
    );
}

export function createJSONCommand(command: RESTPostAPIApplicationCommandsJSONBody) {
    writeFileSync(
        path.resolve(discord_registry_path, 'commands', `${command.name}.json`),
        JSON.stringify(
            {
                ...command,
                application_id: undefined,
                version: undefined,
            }, null, 4
        )
        ,
        {
            encoding: 'utf-8',
        }
    );
}