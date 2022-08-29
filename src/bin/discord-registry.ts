#!/usr/bin/env node
import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import setup from './commands/setup';

const discord_registry = new Command();

const packageFile = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageFile, 'utf-8'));

discord_registry
    .name('discord-registry')
    .version(packageJson.version);

discord_registry
    .command('setup')
    .description('creates a new discord-registry config file')
    .option('-y, --yes')
    .action(setup);

discord_registry
    .command('generate')
    .description('generates a component/piece')
    .alias('g')
    .argument('<component>', 'component/piece name')
    .argument('<name>', 'file name')
    .action(() => {

    });

discord_registry
    .command('init')
    .description('creates a config file on an existing Sapphire project')
    .alias('i')
    .action(() => {

    });

discord_registry.parse(process.argv);