import { Collection } from "@discordjs/collection";
import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v10';

export class DiscordRegistry {
    public rest: REST;
    public commands: Collection<string, RESTPostAPIApplicationCommandsJSONBody> = new Collection();
    private _token: string;
    constructor(
        public application_id: string,
        token: string
    ) {
        this._token = token;
        this.rest = new REST({ version: '10' }).setToken(token);
    }

    public set token(newToken: string) {
        this._token = newToken;
        this.rest.setToken(this._token);
    }

    private get raw_commands_data() {
        let rawCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
        this.commands.forEach(command => rawCommands.push(command));

        return rawCommands;
    }

    public addCommand(command_data: RESTPostAPIApplicationCommandsJSONBody) {
        this.commands.set(command_data.name, command_data);
        return this;
    }

    public deleteCommand(command_name: string) {
        this.commands.delete(command_name);
        return this;
    }

    public addCommands(commands: RESTPostAPIApplicationCommandsJSONBody[]) {
        commands.forEach(command_data => {
            this.addCommand(command_data);
        });
        return this;
    }

    public deleteAllCommmands() {
        this.commands.clear();
        return this;
    }

    public async refresh() {
        await this.rest.put(
            Routes.applicationCommands(this.application_id),
            {
                body: this.raw_commands_data
            }
        )
        return this;
    }

    public async getApplicationCommmands(refresh: boolean = false): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
        let commands = (await this.rest.get(
            Routes.applicationCommands(this.application_id)
        ) as RESTPostAPIApplicationCommandsJSONBody[]);
        if (refresh) {
            commands.forEach(command => {
                this.commands.set(command.name, command);
            });
        }
        return commands;
    }

}