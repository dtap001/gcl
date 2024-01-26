import { UserInteractor } from '@godcli/core';
import fs from 'fs';
import path from 'path';

export class PlaybookUtilities {
  static async selectPlaybook(
    playbooks: string[]
  ): Promise<string | undefined> {
    const playbooksWithDescriptions = playbooks.map((file: string) => {
      const content = fs.readFileSync(file, 'utf8');
      const description =
        content.match(/#\s*description:\s*(.+)\s*/i)?.[1] ||
        'No description provided';
      return `${file}: ${description}`;
    });

    const result = await UserInteractor.selectFromList('Select which playbook to work with:', playbooksWithDescriptions);

    const index = playbooksWithDescriptions.indexOf(result);
    return playbooks[index];
  }
  static async getPlaybookWorkFolder(folders: string[]) {
    const embededPlaybooksFolder = path.join(__dirname, 'assets', 'ansible')
    folders.push(embededPlaybooksFolder);
    const result = await UserInteractor.selectFromList('Select working folder:', folders);
    return result;
  }
}
