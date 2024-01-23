import { GCLCommand, GCLPlugin } from '@godcli/core';
import { MyCommand } from './commands/my.command';
import { MyPLuginConfig } from './my.config';

export class MyPlugin implements GCLPlugin {
  pluginName = 'myPlugin';
  commands: GCLCommand[] = [new MyCommand()];
  config = {
    'myPlugin.my-config-key': 'defaultvalue',
  } as MyPLuginConfig;
}
