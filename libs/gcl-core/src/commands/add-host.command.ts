import { Utilities } from "../utils/general.utilities";
import { InventoryUtilities } from "../utils/inventory.utilities";
import path from "path";
import fs from "fs";
import { UserInteractor } from "../utils/user-interactor.utility";

export class AddHostCommand {
  async run() {
    const inventoryFiles = Utilities.findFilesWithKeyword(
      "inventory",
      Utilities.YAML_FILE_TYPE,
      "."
    );
    if (inventoryFiles.length === 0) {
      console.error(
        `No inventory files found in the current directory: ${path.resolve(
          "."
        )}`
      );
      process.exit(1);
    }
    const createNewInventoryText = "Create new inventory file";
    inventoryFiles.push(createNewInventoryText);
    const selectedInventory = await InventoryUtilities.selectInventory(
      inventoryFiles
    );

    if (!selectedInventory) {
      console.log("Inventory selection was interrupted.");
      process.exit(0);
    }

    let newInventoryFile = false;
    let inventoryPath = selectedInventory;
    if (selectedInventory === createNewInventoryText) {
      newInventoryFile = true;
      inventoryPath = UserInteractor.prompt(
        "Enter the new inventory file name: ",
        (input: string) => {
          const rule = "inventory.yaml";
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const result = require("validator").contains(input, rule);
          if (!result) {
            console.warn(`Input ${input} must contain ${rule}`);
            return false;
          }
          return true;
        }
      );
      Utilities.writeYamlFile(inventoryPath, {});
    }

    const groupName = await InventoryUtilities.selectGroup(inventoryPath);
    const hostName = UserInteractor.prompt(
      "Enter the host name: ",
      (input: string) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("validator").contains(input, "");
      }
    );
    const hostAddress = UserInteractor.prompt(
      "Enter the host address: ",
      (input: string) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("validator").contains(input, "");
      }
    );

    if (newInventoryFile) {
      fs.writeFileSync(inventoryPath, "");
    }
    await this.addHostToInventory(
      inventoryPath,
      hostName,
      groupName,
      hostAddress
    );
    console.log(
      `Host '${hostName}' added to '${inventoryPath}' in group '${groupName}' with address '${hostAddress}'.`
    );
  }

  private async addHostToInventory(
    inventoryPath: string,
    hostName: string,
    groupName: string,
    hostAddress: string
  ) {
    const inventoryData = Utilities.readYamlFile(inventoryPath) || {};

    if (!inventoryData.all) {
      inventoryData.all = { children: {} };
    }
    if (!inventoryData.all.children[groupName]) {
      inventoryData.all.children[groupName] = { hosts: {} };
    }
    inventoryData.all.children[groupName].hosts[hostName] = {
      ansible_host: hostAddress,
      ansible_user: "{{ server_user }}",
    };
    Utilities.writeYamlFile(inventoryPath, inventoryData);
  }
}
