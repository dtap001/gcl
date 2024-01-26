import 'reflect-metadata';
import { DI } from './inversify.core-config';
import { Command } from 'commander';
import { UserInteractor } from './utils';
import { GCLPlugin } from './plugin/plugin.interface';
import { PluginService } from './plugin/plugin.service';
import { ConfigService } from './config';
import { AnsiblePlugin } from './plugins/ansible/ansible.plugin';
import { CorePlugin } from './plugins/core/core.plugin';
import { GCLDependencyCoreTypes } from './inversify.core-types';

export class Wrapper {
  constructor() {
    console.log('Wrapper init started');
    this.pluginService = DI.container.get<PluginService>(
      GCLDependencyCoreTypes.VALUES.PluginService
    );
    this.configService = DI.container.get<ConfigService>(
      GCLDependencyCoreTypes.VALUES.ConfigService
    );
  }

  private pluginService: PluginService;
  private configService: ConfigService;

  async run(args: string[], plugins: GCLPlugin[]): Promise<void> {
    const command = new Command();

    this.pluginService.registerPlugin(new CorePlugin(), command);
    this.pluginService.registerPlugin(new AnsiblePlugin(), command);

    plugins.forEach((plugin) => {
      this.pluginService.registerPlugin(plugin, command);
    });

    if (args.length === 2) {
      await this.handleWhenNoCommandSelected(args, command);
    }

    command.showSuggestionAfterError(true);
    await command.parseAsync(args);
  }

  private async handleWhenNoCommandSelected(args: string[], command: Command) {
    const separator = ` => `;
    const commands = command.commands.map(
      (cmd) => `${cmd.name()}${separator}${cmd.description()}}`
    );

    const result = await UserInteractor.selectFromList(
      `Which command would you like to run run?`,
      commands
    );
    const commandRealName = result.split(separator)[0];
    args.push(commandRealName);
  }
}
