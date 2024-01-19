import { InstallUtilities } from './utils/install.utilities';
import { RunCommand } from './commands/run.command';
import { AddHostCommand } from './commands/add-host.command';
import { ConfigCommand } from './commands/config.command';
import { AddFolderCommand } from './commands/add-folder.command';
import { Command } from 'commander';
import { exit } from 'process';
import { UserInteractor } from './utils';

export class Wrapper {
  async run(args: string[], command?: Command): Promise<void> {
    if (!command) {
      command = new Command();
    }
    command
      .command('version')
      .description('Get running version')
      .action(async () => {
        console.log(process.env['npm_package_version'] || '0.0.0');
      });
    command
      .command('run')
      .description('Run Ansible playbook with interactive selection')
      .action(async () => {
        new RunCommand().run();
      });

    command
      .command('addHost')
      .description('Add a new host to an inventory file')
      .action(async () => {
        new AddHostCommand().run();
      });
    command
      .command('addFolder')
      .description('Add current folder as working folder for gcl')
      .action(async () => {
        new AddFolderCommand().run();
      });
    command
      .command('config')
      .description(
        'by default it will print the current config. Use --edit to change it'
      )
      .option('--edit', 'edit config')
      .action(async (options) => {
        const configCommand = new ConfigCommand();
        await configCommand.run(options.edit);
      });

    if (args.length === 2) {
      await this.handleWhenNoCommandSelected(args, command);
    }

    command.showSuggestionAfterError(true);

    await InstallUtilities.checkForUpdates();
    await InstallUtilities.checkAnsibleInstallation();
    // await InstallUtilities.checkSSHPassIntallation().catch((err) => {
    //   console.error(`Failed to continue. Please fix ${err.message}`);
    //   exit();
    // });

    await command.parseAsync(args);
  }

  private async handleWhenNoCommandSelected(args: string[], command: Command) {
    const separator = ` => `;
    const commands = command.commands.map(
      (cmd) => `${cmd.name()}${separator}${cmd.description()}}`
    );
    const result = await UserInteractor.selectFromList(
      `Which command would you like to run? `,
      commands
    );
    const commandRealName = result.split(separator)[0];
    args.push(commandRealName);
  }
}
