import {
  DIConfig,
  GCLCommand,
  GCLPlugin,
} from '@godcli/core';
import { MyCommand } from './commands/my.command';
import { MyPLuginConfig } from './my.config';
import { Container } from 'inversify';

export class MyPlugin implements GCLPlugin {
  pluginName = 'myPlugin';
  commands = () =>  [];
  config = {
    'myPlugin.my-config-key': 'defaultvalue',
  } as MyPLuginConfig;
  di = {
    types: {
      ConfigCommand: Symbol('ConfigCommand'),
    },
    register: (container: Container) => {
    },
  };
  constructor() {
    console.log('MyPlugin constructor');
    // DIConfig.addExtraConfig(
    //   {
    //     MyCommand: Symbol('MyCommand'),
    //   } ,
    //   () => {
    //     DIConfig.container.bind<MyCommand>(DIConfig.TYPES['MyCommand']).to(MyCommand);
    //   }
    // );
    // this.commands.push(DIConfig.container.get<MyCommand>(DIConfig.TYPES.AnsibleRunCommand));
  }
}
