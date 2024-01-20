import TYPES from '../../inversifiy.types';
import container from '../../inversify.config';
import { GCLPlugin } from '../../plugin/plugin.interface';
import { AddFolderCommand } from './commands/add-folder.command';
import { AddHostCommand } from './commands/add-host.command';
import { AnsibleRunCommand } from './commands/run.command';
export class AnsiblePlugin implements GCLPlugin {
  pluginName = `ansible`;
  commands = [
    container.get<AnsibleRunCommand>(TYPES.AnsibleRunCommand),
    container.get<AddHostCommand>(TYPES.AddHostCommand),
    container.get<AddFolderCommand>(TYPES.AddFolderCommand),
  ];
  config = [
    {
      name: `${this.pluginName}.workingFolders`,
      type: typeof ``,
    },
    { name: `${this.pluginName}.defaultHost`, type: typeof `` },
    { name: `${this.pluginName}.checkedAnsibleIntall`, type: typeof Boolean },
  ];
}
