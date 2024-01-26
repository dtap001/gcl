import { GCLPlugin } from '../../plugin/plugin.interface';
import { AddFolderCommand } from './commands/add-folder.command';
import { AddHostCommand } from './commands/add-host.command';
import { AnsibleRunCommand } from './commands/run.command';
import { DI } from '../../inversify.core-config';
import { Container } from 'inversify';
export class AnsiblePlugin implements GCLPlugin {
  pluginName = `ansible`;
  commands = () => [
    DI.container.get<AnsibleRunCommand>(this.dependencies.types.AnsibleRunCommand),
    DI.container.get<AddHostCommand>(this.dependencies.types.AddHostCommand),
    DI.container.get<AddFolderCommand>(this.dependencies.types.AddFolderCommand),
  ];
  config = {
    'ansible.workingFolders': '',
    'ansible.defaultHost': '',
    'ansible.checkedAnsibleIntall': false,
  };
  dependencies = {
    types: {
      AddFolderCommand: Symbol('AddFolderCommand'),
      AddHostCommand: Symbol('AddHostCommand'),
      AnsibleRunCommand: Symbol('AnsibleRunCommand'),
    },
    register: (container: Container) => {
      container
        .bind<AddFolderCommand>(this.dependencies.types.AddFolderCommand)
        .to(AddFolderCommand);
      container
        .bind<AddHostCommand>(this.dependencies.types.AddHostCommand)
        .to(AddHostCommand);
      container
        .bind<AnsibleRunCommand>(this.dependencies.types.AnsibleRunCommand)
        .to(AnsibleRunCommand);
    },
  };
}
