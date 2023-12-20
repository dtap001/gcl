import { execSync } from "child_process";
import { Configuration } from "../config/config";
import { UserInteractor } from "./user-interactor.utility";

export class InstallUtilities {
  protected static checkPipInstallation(): boolean {
    try {
      execSync("pip --version", { stdio: "pipe" });
      console.log("Pip is installed.");
    } catch (error) {
      console.error("Pip is not installed.");
      return false;
    }
    return true;
  }

  protected static installPipIfNotInstalled() {
    if (!this.checkPipInstallation()) {
      console.log("Trying to install pip..");
      try {
        execSync("sudo apt-get install python3-pip", { stdio: "inherit" });
        console.log("Pip installed successfully.");
      } catch (installError) {
        console.error("Failed to install pip. Please install it manually.");
        process.exit(1);
      }
    }
  }

  static async checkSSHPassIntallation(): Promise<void> {
    const stdout = execSync("sshpass -V", { encoding: 'utf-8' });
    if (!stdout.includes('Shachar Shemesh')) {
      throw new Error(`Missing tool sshpass please install it!`);
    }
  }

  static async checkAnsibleInstallation(): Promise<void> {
    if (Configuration.getConfig().checkedAnsibleIntall) {
      return;
    }
    InstallUtilities.installPipIfNotInstalled();
    try {
      execSync("ansible --version", { stdio: "pipe" });
      console.log("Ansible is installed.");
      Configuration.setCheckedAnsibleInstall(true);
    } catch (error) {
      console.error("Ansible is not installed.");

      const answer = UserInteractor.prompt(
        "Do you want to install Ansible? (y/n): ",
        (input: string) => {
          return input === "y" || input === "n";
        }
      );
      if (answer.toLowerCase() === "y") {
        try {
          console.log("Installing Ansible...");
          execSync("pip install ansible", { stdio: "inherit" });
          console.log("Ansible installed successfully.");
        } catch (installError) {
          console.error(
            "Failed to install Ansible. Please install it manually."
          );
          process.exit(1);
        }
      } else {
        console.log("Please install Ansible and try again.");
        process.exit(1);
      }
    }
  }

  static async checkForUpdates() {
    const now = new Date();
    const lastUpdateCheck = new Date(Configuration.getConfig().lastUpdateCheck);
    const hoursSinceLastCheck =
      (now.getTime() - lastUpdateCheck.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastCheck >= 24) {
      console.log("Checking for updates...");

      Configuration.setLastUpdateCheck(now);
      try {
        const stdout = execSync("npm update -g @gcl/gcl", { encoding: 'utf-8' });
        console.log(`Successfully updated my-cli-tool: ${stdout}`);
      } catch (error) {
        console.error(`Error updating my-cli-tool: ${error.message}`);
      }
    }
  }
}
