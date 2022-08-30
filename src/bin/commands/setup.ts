import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import prompts from "prompts";
import { DiscordRegistry } from "../../lib/index.js";
import { createJSCommand, createJSONCommand, createTSCommand } from "../utils.js";

const discord_registry_path = path.resolve(process.cwd(), 'discord-registry');

export default async function () {
    if (existsSync(path.resolve(discord_registry_path, 'config.json'))) {
        let { confirmation } = await prompts({
            type: 'confirm',
            name: 'confirmation',
            message: 'This project has already been prepared.\n would you like to overwrite it?',
            initial: false
        });

        if (!confirmation) return console.log('GoodBye...');
    }

    let data = await prompts([
        {
            type: 'text',
            name: 'application_id',
            message: 'Enter your application id'
        },
        {
            type: 'text',
            name: 'token',
            message: 'Enter your bot token'
        },
        {
            type: 'confirm',
            name: 'get_commands',
            message: 'Would you like to fetch the current commands form discord api?',
            initial: true
        },
        {
            type: 'select',
            name: 'extension',
            message: 'Choose an extension',
            choices: [
                {
                    title: 'Typescript (Recommended)',
                    selected: true,
                    value: 'ts'
                },
                {
                    title: 'Javascript',
                    selected: false,
                    value: 'js'
                },
                {
                    title: 'JSON',
                    selected: false,
                    value: 'json'
                }
            ]
        }
    ]);

    try {
        const registry = new DiscordRegistry(data.application_id, data.token);
        if (!existsSync(discord_registry_path)) {
            mkdirSync(discord_registry_path);
            mkdirSync(path.resolve(discord_registry_path, 'commands'));
        }

        if (data.get_commands) {
            let commands = await registry.getApplicationCommmands(true);
            commands.forEach(command => {
                switch (data.extension) {
                    case 'ts':
                        createTSCommand(command)
                        break;
                    case 'js':
                        createJSCommand(command)
                        break;
                    default:
                        createJSONCommand(command)
                        break;
                }
            });
        }
        data.get_commands = undefined;

        writeFileSync(
            path.resolve(discord_registry_path, 'config.json'),
            JSON.stringify(data, null, 4),
            {
                encoding: 'utf-8',
            }
        );

    } catch (error) {
        throw error;
    }
}