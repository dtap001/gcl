import { ConfigCommand } from './commands/config.command';
import { Container } from 'inversify';
import {  GCLPlugin } from '@godcli/plugins/interfaces';

export class CorePlugin implements GCLPlugin {
  pluginName = 'core';
  commands = (container: Container) => [
    container.get<ConfigCommand>(this.dependencies.types.ConfigCommand),
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
