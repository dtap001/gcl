#!/usr/bin/env node
import { Wrapper } from '@godcli/core';
import { Command } from 'commander';
async function run() {
  const command = new Command();
  command
    .command('my custom comand')
    .description('My command description')
    .action(async () => {
      console.log(process.env['npm_package_version'] || '0.0.0');
    });
  await new Wrapper().run(process.argv, command);
}
run();
