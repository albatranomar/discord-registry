import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import prompts from "prompts";
import { DiscordRegistry } from "../../lib/index.js";

export default async function () {
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
        }
    ]);

    try {
        const registry = new DiscordRegistry(data.application_id, data.token);
        let discord_registry_path = path.resolve(process.cwd(), 'discord-registry');
        if (!existsSync(discord_registry_path)) {
            mkdirSync(discord_registry_path);
            mkdirSync(path.resolve(discord_registry_path, 'commands'));
        }

        if (data.get_commands) {
            let commands = await registry.getApplicationCommmands(true);
            commands.forEach(command => {
                writeFileSync(
                    path.resolve(discord_registry_path, 'commands', `${command.name}.json`),
                    JSON.stringify(command, null, 4),
                    {
                        encoding: 'utf-8',
                    }
                );
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