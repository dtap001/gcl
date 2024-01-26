import 'reflect-metadata';
import { Command } from 'commander';
import { GCLPlugin } from '@godcli/plugins/interfaces';
import { CorePlugin } from '@godcli/plugins/core';
import { AnsiblePlugin } from '@godcli/plugins/ansible';
import { DI, PluginService, GCLDependencyCoreTypes, UserInteractor, Logger } from '@godcli/core';

export class Wrapper {
  constructor() {
    this.pluginService = DI.container.get<PluginService>(
      GCLDependencyCoreTypes.VALUES.PluginService
    );
  }

  private pluginService: PluginService;

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
    const commandRealName = result?.split(separator)[0];
    if(!commandRealName){
      Logger.info('No command selected. Exiting');
      return;
    }
    args.push(commandRealName);
  }
}

