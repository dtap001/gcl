import { TYPES, container } from '../../inversify.config';
import { GCLPlugin } from '../../plugin/plugin.interface';
import { ConfigCommand } from './commands/config.command';

export class CorePlugin implements GCLPlugin {
  pluginName = 'core';
  commands = [container.get<ConfigCommand>(TYPES.ConfigCommand)];
  config = {
    'core.lastUpdateCheck': '',
  };
}
