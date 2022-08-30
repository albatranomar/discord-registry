import { ApplicationCommandType, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { existsSync, readFileSync } from "fs";
import path from "path";
import prompts from "prompts";
import { createJSCommand, createJSONCommand, createTSCommand } from "../utils.js";

const discord_registry_path = path.resolve(process.cwd(), 'discord-registry');

export default async function (_type: string, name: string) {
    if (!existsSync(path.resolve(discord_registry_path, 'config.json'))) return console.error('make sure to setup your project via `discord-registry setup`');
    let discord_registry_config = JSON.parse(
        readFileSync(path.resolve(discord_registry_path, 'config.json'), { encoding: 'utf-8' })
    );

    let type: ApplicationCommandType = ApplicationCommandType.ChatInput;
    switch (_type) {
        case 'slash':
            type = ApplicationCommandType.ChatInput;
            break;
        case 'message':
            type = ApplicationCommandType.Message;
            break;
        case 'user':
            type = ApplicationCommandType.User;
            break;
        default:
            _type = 'unknown'
            break;
    }
    if (_type == 'unknown') return console.error(`please provide a valid command type (slash/message/user)`);
    try {
        let command: RESTPostAPIApplicationCommandsJSONBody = {
            name,
            type: type as number
        };
        let answers = await prompts([
            {
                type: 'text',
                name: 'name',
                message: 'command name',
                initial: command.name,
                validate(prev: string) {
                    if (command.type == ApplicationCommandType.ChatInput) {
                        return RegExp(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/iug).test(prev.toLowerCase().trim())
                            ? true
                            : 'Please enter a valid command name';
                    }
                    return true;
                },
                format(prev: string) {
                    return prev.toLowerCase();
                }
            },
            {
                type: 'text',
                name: 'description',
                message: 'command description',
                validate(prev: string) {
                    const pass = prev.match(/^.{1,100}$/i);
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid command description';
                }
            },
            {
                type: 'confirm',
                name: 'dm_permission',
                message: 'is this command available in dms?',
                initial: true
            },
        ]);
        command = {
            ...command,
            ...answers
        }

        switch (discord_registry_config.extension) {
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

    } catch (error) {
        throw error;
    }
}