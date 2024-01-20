import 'reflect-metadata';
import { InstallUtilities } from './plugins/ansible/utils/install.utilities';
import { AnsibleRunCommand } from './plugins/ansible/commands/run.command';
import { AddHostCommand } from './plugins/ansible/commands/add-host.command';
import { ConfigCommand } from './plugins/core/commands/config.command';
import { AddFolderCommand } from './plugins/ansible/commands/add-folder.command';
import { Command } from 'commander';
import { UserInteractor } from './utils';
import { GCLCommand } from './plugin/plugin.interface';
import { PluginService } from './plugin/plugin.service';
import { ConfigService } from './config';
import { injectable } from 'inversify';
import TYPES from './inversifiy.types';
import container from './inversify.config';

@injectable()
export class Wrapper {
  private pluginService = container.get<PluginService>(TYPES.PluginService);
  private configService = container.get<ConfigService>(TYPES.ConfigService);

  async run(args: string[], plugins: GCLCommand[]): Promise<void> {
    const command = new Command();

    this.addCorePlugins(command);
    this.addAnsiblePlugins(command);

    plugins.forEach((plugin) => {
      this.pluginService.registerPlugin(plugin, command);
    });

    if (args.length === 2) {
      await this.handleWhenNoCommandSelected(args, command);
    }

    command.showSuggestionAfterError(true);

    await InstallUtilities.checkForUpdates(this.configService);
    await InstallUtilities.checkAnsibleInstallation(this.configService);
    // await InstallUtilities.checkSSHPassIntallation().catch((err) => {
    //   console.error(`Failed to continue. Please fix ${err.message}`);
    //   exit();
    // });

    await command.parseAsync(args);
  }

  private addAnsiblePlugins(command: Command) {
    this.pluginService.registerPlugin(
      {
        command: 'run',
        description: 'Run Ansible playbook with interactive selection',
        config: [
          {
            name: 'ansible.workingFolders',
            type: typeof '',
          },
          { name: 'ansible.defaultHost', type: typeof '' },
          { name: 'ansible.checkedAnsibleIntall', type: typeof Boolean },
        ],
        action: async () => {
          await container.get<AnsibleRunCommand>(TYPES.AnsibleRunCommand).run();
        },
      },
      command
    );

    this.pluginService.registerPlugin(
      {
        command: 'addHost',
        description: 'Add a new host to an inventory file',
        action: async () => {
          await container.get<AddHostCommand>(TYPES.AddHostCommand).run();
        },
      },
      command
    );

    this.pluginService.registerPlugin(
      {
        command: 'addFolder',
        description: 'Add current folder as working folder for gcl',
        config: [{ name: 'ansible.workingFolders', type: typeof [] }],
        action: async () => {
          await container.get<AddFolderCommand>(TYPES.AddFolderCommand).run();
        },
      },
      command
    );
  }

  addCorePlugins(command: Command) {
    this.pluginService.registerPlugin(
      {
        command: 'version',
        description: 'Get running version',
        action: async () => {
          console.log(process.env['npm_package_version'] || '0.0.0');
        },
      },
      command
    );
    this.pluginService.registerPlugin(
      {
        command: 'config',
        description:
          'by default it will print the current config. Use --edit to change it',
        options: [
          {
            name: '--edit',
            description: 'edit config',
            default: false,
          },
        ],
        action: async (options) => {
          await container.get<ConfigCommand>(TYPES.ConfigCommand).run(options['edit'] as boolean);
        },
      },
      command
    );
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
