import { GCLPlugin } from '../../plugin/plugin.interface';
import { AddFolderCommand } from './commands/add-folder.command';
import { AddHostCommand } from './commands/add-host.command';
import { AnsibleRunCommand } from './commands/run.command';
import { DIConfig } from '../../inversify.core-config';
import { Container } from 'inversify';
export class AnsiblePlugin implements GCLPlugin {
  pluginName = `ansible`;
  commands = () => [
    /* DIConfig.container.get<AnsibleRunCommand>(DIConfig.TYPES.AnsibleRunCommand),
    DIConfig.container.get<AddHostCommand>(DIConfig.TYPES.AddHostCommand),
    DIConfig.container.get<AddFolderCommand>(DIConfig.TYPES.AddFolderCommand),*/
  ];
  config = {
    'ansible.workingFolders': '',
    'ansible.defaultHost': '',
    'ansible.checkedAnsibleIntall': false,
  };
  di = {
    types: {
      ConfigCommand: Symbol('ConfigCommand'),
    },
    register: (container: Container) => {
    },
  };
}
