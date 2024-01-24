import {
  GCLCommand,
  GCLPlugin,
  TYPES,
  addExtraConfig,
  container,
} from '@godcli/core';
import { MyCommand } from './commands/my.command';
import { MyPLuginConfig } from './my.config';

addExtraConfig(
  {
    MyCommand: Symbol('MyCommand'),
  },
  () => {
    container.bind<MyCommand>(TYPES['MyCommand']).to(MyCommand);
  }
);

export class MyPlugin implements GCLPlugin {
  pluginName = 'myPlugin';
  commands: GCLCommand[] = [container.get<MyCommand>(TYPES.AnsibleRunCommand)];
  config = {
    'myPlugin.my-config-key': 'defaultvalue',
  } as MyPLuginConfig;
}
