import { GCLCommand, GCLPlugin, GCLPluginConfig } from '@godcli/core';
import { MyCommand } from './commands/my.command';

export class MyPlugin implements GCLPlugin {
  pluginName = 'myPlugin';
  commands: GCLCommand[] = [new MyCommand()];
  config?: GCLPluginConfig[] = [
    {
      name: `${this.pluginName}.my-config-key`,
      type: 'string',
    },
  ];
}
