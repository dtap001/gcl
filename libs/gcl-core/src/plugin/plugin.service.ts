import { Command } from 'commander';
import { GCLCommand, GCLPlugin } from './plugin.interface';
import { ConfigService } from '../config';
import { inject, injectable } from 'inversify';
import { Logger } from '../utils/logging';
import { TYPES } from '../inversify.config';

@injectable()
export class PluginService {
  plugins: GCLPlugin[] = [];
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService
  ) {}

  public registerPlugin(plugin: GCLPlugin, commanderCommand: Command) {
    Logger.debug(`Registering plugin ${plugin.pluginName}`);
    this.plugins.push(plugin);
    plugin.commands.forEach((gclCommand: GCLCommand) => {
      Logger.debug(`Registering command ${gclCommand.command}`);
      const commandAtBuild = commanderCommand
        .command(`${plugin.pluginName}:${gclCommand.command}`)
        .description(gclCommand.description)
        .action((option) => {
          gclCommand.action(option);
        });

      if (gclCommand.options) {
        gclCommand.options.forEach((option) => {
          commandAtBuild.option(
            option.name,
            '--' + option.description,
            option.description
          );
        });
      }
    });
    if (plugin.config) {
      this.configService.registerKnownConfig(plugin.config);
    }
  }
}
