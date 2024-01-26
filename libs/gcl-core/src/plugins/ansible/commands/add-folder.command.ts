import path from 'path';
import { ConfigService } from '../../../config/config.service';
import { UserInteractor } from '../../../utils/user-interactor.utility';
import { inject, injectable } from 'inversify';
import { GCLCommand, GCLCommandOption } from '../../../plugin/plugin.interface';
import { AnsibleConfig } from '../ansible.config';
import { GCLDependencyCoreTypes } from '../../../inversify.core-types';

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
