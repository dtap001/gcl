import { injectable, inject } from 'inversify';
import path from 'path';
import { AnsibleConfig } from '../ansible.config';
import { GCLDependencyCoreTypes, ConfigService, UserInteractor } from '@godcli/core';
import { GCLCommand, GCLCommandOption } from '@godcli/plugins/interfaces';

@injectable()
export class AddFolderCommand implements GCLCommand {
  constructor(
    @inject(GCLDependencyCoreTypes.VALUES.ConfigService) private configService: ConfigService
  ) {}
  command = 'addFolder';
  description = 'Add folder to ansible working folders';

  options?: GCLCommandOption[] | undefined;
  async action(options: {
    [x: string]: string | number | boolean;
  }): Promise<void> {
    const workingFolders = this.configService.getConfig<AnsibleConfig>()[
      'ansible.workingFolders'
    ] as string[]; // TODO: fix this
    console.log(`Currently added folders: ${workingFolders.join('\n')}`);
    const approved = UserInteractor.prompt(
      `Do you really want to add this folder ${path.resolve('.')} ?`,
      (input: string) => {
        return input === 'y' || input === 'n';
      }
    );
    if (approved === 'y') {
      workingFolders.push(path.resolve('.'));
      this.configService.setConfigValue<AnsibleConfig>(
        'ansible.workingFolders',
        workingFolders
      );
    }
  }
}
