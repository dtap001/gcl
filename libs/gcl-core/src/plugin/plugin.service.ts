import { Command } from 'commander';
import { GCLCommand, GCLPlugin } from './plugin.interface';
import { ConfigService } from '../config';
import { inject, injectable } from 'inversify';
import { Logger } from '../utils/logging';
import { DI } from '../inversify.core-config';
import { GCLDependencyCoreTypes } from '../inversify.core-types';

@injectable()
export class PluginService {
  plugins: GCLPlugin[] = [];
  constructor(
    @inject(GCLDependencyCoreTypes.VALUES.ConfigService)
    private configService: ConfigService
  ) {}

  public registerPlugin(plugin: GCLPlugin, commanderCommand: Command) {
    Logger.debug(`Registering plugin ${plugin.pluginName}`);
    this.plugins.push(plugin);
    plugin.dependencies.register(DI.container);

    plugin.commands().forEach((gclCommand: GCLCommand) => {
      Logger.debug(
        `Registering plugin command ${plugin.pluginName}:${gclCommand.command}`
      );
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
