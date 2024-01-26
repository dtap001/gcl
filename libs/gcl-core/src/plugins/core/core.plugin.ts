import { DI } from '../../inversify.core-config';
import { GCLPlugin } from '../../plugin/plugin.interface';
import { ConfigCommand } from './commands/config.command';
import { Container } from 'inversify';

export class CorePlugin implements GCLPlugin {
  pluginName = 'core';
  commands = () => [
    DI.container.get<ConfigCommand>(this.dependencies.types.ConfigCommand),
  ];
  config = {
    'core.lastUpdateCheck': '',
  };
  dependencies = {
    types: {
      ConfigCommand: Symbol('ConfigCommand'),
    },
    register: (container: Container) => {
      container
        .bind<ConfigCommand>(this.dependencies.types.ConfigCommand)
        .to(ConfigCommand);
    },
  };
}
