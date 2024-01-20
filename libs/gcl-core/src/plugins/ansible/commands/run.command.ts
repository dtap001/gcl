import { Utilities } from '../../../utils/general.utilities';
import { PlaybookUtilities } from '../utils/playbook.utilities';
import { InventoryUtilities } from '../utils/inventory.utilities';
import { ConfigService } from '../../../config/config.service';
import { execSync } from 'child_process';
import path from 'path';
import { inject, injectable } from 'inversify';
import TYPES from '../../../inversifiy.types';
import { GCLCommand, GCLCommandOption } from '../../../plugin/plugin.interface';

@injectable()
export class AnsibleRunCommand implements GCLCommand {
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService
  ) {}

  options?: GCLCommandOption[] | undefined;
  command = 'run';
  description = 'Run playbook with interactive selection';

  async action(options: {
    [x: string]: string | number | boolean;
  }): Promise<void> {
    const workingFolder = await PlaybookUtilities.getPlaybookWorkFolder(
      this.configService.getConfig()['ansible.workingFolders'] as string[] // TODO: fix this
    );
    if (!workingFolder || workingFolder.length === 0) {
      console.error(`No working folder is selected!`);
      process.exit(1);
    }
    const playbooks = Utilities.findFilesWithKeyword(
      'playbook',
      Utilities.YAML_FILE_TYPE,
      workingFolder
    );
    console.log('Select which inventory to use:');
    const inventoryFiles = Utilities.findFilesWithKeyword(
      'inventory',
      Utilities.YAML_FILE_TYPE,
      workingFolder
    );

    if (!playbooks || playbooks.length === 0) {
      console.error(
        `No playbooks found in the current directory: ${path.resolve(
          workingFolder
        )}`
      );
      process.exit(1);
    }

    if (!inventoryFiles || inventoryFiles.length === 0) {
      console.error(
        `No inventory files found in the current directory: ${path.resolve(
          workingFolder
        )}`
      );
      process.exit(1);
    }

    const playbookFilePath = await PlaybookUtilities.selectPlaybook(playbooks);
    if (!playbookFilePath) {
      console.log('Playbook selection was interrupted.');
      process.exit(0);
    }

    const inventoryFilePath = await InventoryUtilities.selectInventory(
      inventoryFiles
    );
    if (!inventoryFilePath) {
      console.log('Inventory selection was interrupted.');
      process.exit(0);
    }
    const selectedHost = await InventoryUtilities.selectHosts(
      inventoryFilePath
    );
    if (!selectedHost) {
      console.log('Host selection was interrupted.');
      process.exit(0);
    }

    console.log(`Running playbook: ${playbookFilePath}`);
    console.log(`Using inventory: ${inventoryFilePath}`);
    console.log(`Selected hosts: ${selectedHost}`);

    try {
      execSync(
        `ansible-playbook -i ${inventoryFilePath} --limit ${selectedHost} ${playbookFilePath} --ask-pass`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error running playbook:', error.message);
      }
    }
  }
}
