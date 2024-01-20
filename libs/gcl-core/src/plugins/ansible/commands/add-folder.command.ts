import path from 'path';
import { ConfigService } from '../../../config/config.service';
import { UserInteractor } from '../../../utils/user-interactor.utility';
import { inject, injectable } from 'inversify';
import TYPES from '../../../inversifiy.types';
import { GCLCommand, GCLCommandOption } from '../../../plugin/plugin.interface';

@injectable()
export class AddFolderCommand implements GCLCommand {
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService
  ) {}
  command = 'addFolder';
  description = 'Add folder to ansible working folders';

  options?: GCLCommandOption[] | undefined;
  async action(options: {
    [x: string]: string | number | boolean;
  }): Promise<void> {
    const workingFolders = this.configService.getConfig()[
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
      this.configService.setConfigValue(
        'ansible.workingFolders',
        workingFolders
      );
    }
  }
}
