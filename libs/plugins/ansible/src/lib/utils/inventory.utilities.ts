import { UserInteractor, Utilities } from "@godcli/core";

export class InventoryUtilities {
  static async selectInventory(
    inventoryFiles: string[]
  ): Promise<string | undefined> {
    const result = await UserInteractor.selectFromList('Select inventory file:', inventoryFiles);

    const index = inventoryFiles.indexOf(result);
    return inventoryFiles[index];
  }

  static async selectGroup(inventoryPath: string): Promise<string | undefined> {
    const inventoryData = Utilities.readYamlFile(inventoryPath) || {};
    const groups = inventoryData.all?.children
      ? Object.keys(inventoryData.all.children)
      : [];
    groups.push('Create new group');

    const selectedGroup = await UserInteractor.selectFromList('Select inventory group:', groups);

    let groupName = selectedGroup;
    if (groupName === 'Create new group') {
      groupName = UserInteractor.prompt('Enter the new group name: ', () => true);
    }

    return groupName;
  }

  static async selectHosts(
    inventoryFilePath: string
  ): Promise<string | undefined> {
    const inventoryFile = Utilities.readYamlFile(inventoryFilePath);

    const allChildren = inventoryFile.all.children;
    const groupKeys = Object.keys(allChildren);

    const hostsWithGroup = [];

    for (let groupIndex = 0; groupIndex < groupKeys.length; groupIndex++) {
      const groupKey = groupKeys[groupIndex];
      hostsWithGroup.push(groupKey); // Include the group name

      const group = allChildren[groupKey];
      const hostKeys = Object.keys(group.hosts);

      for (
        let hostKeyIndex = 0;
        hostKeyIndex < hostKeys.length;
        hostKeyIndex++
      ) {
        const host = hostKeys[hostKeyIndex];
        hostsWithGroup.push(`${groupKey}:${host}`);
      }
    }

    const result = await UserInteractor.selectFromList('Select host as target:', hostsWithGroup);
    if (result.includes(':')) {
      return result.split(':')[1];
    } else {
      const warning = `You selected a host group which means your playbook will be run on ALL childrends of that group:
${hostsWithGroup.map(item => item + '\n')}
Do you want this? (y/n)`;

      const answer = UserInteractor.prompt(
        warning,
        (input: string) => {
          return input === 'y' || input === 'n';
        }
      );
      if (answer.toLowerCase() !== 'y') {
        throw new Error('These hosts are not the one you are looking for. 🪄');
      }
    }
    return result; // todo return host object
  }
}
