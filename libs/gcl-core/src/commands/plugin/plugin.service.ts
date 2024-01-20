import { Command } from 'commander';
import { GCLPlugin } from './plugin.interface';
import { ConfigService } from '../../config';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversifiy.types';
import { Logger } from '../../utils/logging';

@injectable()
export class PluginService {
  plugins: GCLPlugin[] = [];
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService
  ) {}

  public registerPlugin(plugin: GCLPlugin, command: Command) {
    Logger.info(`Registering plugin ${plugin.command}`);
    this.plugins.push(plugin);

    const commandAtBuild = command
      .command(plugin.command)
      .description(plugin.description)
      .action(plugin.action);

    if (plugin.options) {
      plugin.options.forEach((option) => {
        commandAtBuild.option(
          option.name,
          option.description,
          option.description
        );
      });
    }

    plugin.config?.forEach((config) => {
      this.configService.registerKnownConfig(config);
    });
  }
}
