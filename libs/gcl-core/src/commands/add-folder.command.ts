import path from 'path';
import { Configuration } from '../config/config';
import { UserInteractor } from '../utils/user-interactor.utility';
export class AddFolderCommand {
  async run() {
    const config = Configuration.getConfig();
    console.log(`Currently added folders: ${config.workingFolders.join('\n')}`);
    const approved = UserInteractor.prompt(
      `Do you really want to add this folder ${path.resolve('.')} ?`,
      (input: string) => {
        return input === 'y' || input === 'n';
      }
    );
    if (approved === 'y') {
      Configuration.addWorkingFolder(path.resolve('.'));
    }
  }
}
