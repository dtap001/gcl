import path from 'path';
import { Configuration } from '../config/config.utility';
import { UserInteractor } from '../utils/user-interactor.utility';
export class AddFolderCommand {
  async run() {
    const workingFolders = Configuration.getConfig()['ansible.workingFolders'];
    console.log(`Currently added folders: ${workingFolders.join('\n')}`);
    const approved = UserInteractor.prompt(
      `Do you really want to add this folder ${path.resolve('.')} ?`,
      (input: string) => {
        return input === 'y' || input === 'n';
      }
    );
    if (approved === 'y') {
      workingFolders.push(path.resolve('.'));
      Configuration.setConfigValue('ansible.workingFolders', workingFolders);
    }
  }
}
