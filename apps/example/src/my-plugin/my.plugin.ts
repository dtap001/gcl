import { DI, GCLPlugin } from '@godcli/core';
import { MyPLuginConfig } from './my.config';
import { Container } from 'inversify';
import { MyCommand } from './commands/my.command';

export class MyPlugin implements GCLPlugin {
  pluginName = 'myPlugin';
  commands = () =>  [
    DI.container.get<MyCommand>(this.dependencies.types.MyCommand),
  ];
  config = {
    'myPlugin.my-config-key': 'defaultvalue',
  } as MyPLuginConfig;
  dependencies = {
    types: {
      MyCommand: Symbol('MyCommand'),
    },
    register: (container: Container) => {
      container.bind<MyCommand>(this.dependencies.types.MyCommand).to(MyCommand);
    },
  };
  constructor() {
    console.log('MyPlugin constructor');
  }
}
