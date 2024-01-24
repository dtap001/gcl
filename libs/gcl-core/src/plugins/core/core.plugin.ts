import { DI, DIConfig } from '../../inversify.core-config';
import { DITypes } from '../../inversify.core-types';
import { GCLPlugin } from '../../plugin/plugin.interface';
import { ConfigCommand } from './commands/config.command';
import { Container } from 'inversify';

export class CorePlugin implements GCLPlugin {
  pluginName = 'core';
  commands = () => [
    DI.container.get<ConfigCommand>(this.di.types.ConfigCommand),
  ];
  config = {
    'core.lastUpdateCheck': '',
  };
  di = {
    types: {
      ConfigCommand: Symbol('ConfigCommand'),
    },
    register: (container: Container) => {
      container.bind<ConfigCommand>(this.di.types.ConfigCommand).to(ConfigCommand);
    },
  };
}

