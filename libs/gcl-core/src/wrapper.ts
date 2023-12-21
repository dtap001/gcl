import { InstallUtilities } from './utils/install.utilities';
import { RunCommand } from './commands/run.command';
import { AddHostCommand } from './commands/add-host.command';
import { ConfigCommand } from './commands/config.command';
import { AddFolderCommand } from './commands/add-folder.command';
import { Command } from 'commander';
import { exit } from 'process';


export class Wrapper {
  async run(args: string[]) {
    const program = new Command();
    program.showSuggestionAfterError(true);

    await InstallUtilities.checkForUpdates();

    await InstallUtilities.checkAnsibleInstallation();
    // await InstallUtilities.checkSSHPassIntallation().catch((err) => {
    //   console.error(`Failed to continue. Please fix ${err.message}`);
    //   exit();
    // });

    program
      .command('version')
      .description('Get running version')
      .action(async () => {
        console.log(process.env.npm_package_version || '0.0.0');
      });
    program
      .command('run')
      .description('Run Ansible playbook with interactive selection')
      .action(async () => {
        new RunCommand().run();
      });

    program
      .command('addHost')
      .description('Add a new host to an inventory file')
      .action(async () => {
        new AddHostCommand().run();
      });
    program
      .command('addFolder')
      .description('Add current folder as working folder for gcl')
      .action(async () => {
        new AddFolderCommand().run();
      });
    program
      .command('config')
      .description(
        'by default it will print the current config. Use --edit to change it'
      )
      .option('--edit', 'edit config')
      .action(async (options) => {
        const configCommand = new ConfigCommand();
        await configCommand.run(options.edit);
      });
    await program.parseAsync(args);
  }
}