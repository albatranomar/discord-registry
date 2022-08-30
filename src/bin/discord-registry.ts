#!/usr/bin/env node

import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import generate from './commands/generate.js';
import setup from './commands/setup.js';

const discord_registry = new Command();

const packageFile = new URL('../../package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageFile, 'utf-8'));

discord_registry
    .name('discord-registry')
    .version(packageJson.version);

discord_registry
    .command('setup')
    .description('creates a new discord-registry config file')
    .action(setup);

discord_registry
    .command('generate')
    .description('generates a slash/user/message commands.')
    .alias('g')
    .argument('<type>', 'type of the generated command (slash/user/message)')
    .argument('[name]', 'command name')
    .action(generate);

discord_registry
    .command('init')
    .description('creates a config file on an existing Sapphire project')
    .alias('i')
    .action(() => {

    });

discord_registry.parse(process.argv);