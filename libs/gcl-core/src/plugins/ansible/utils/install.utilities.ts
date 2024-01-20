import { execSync } from 'child_process';
import { ConfigService } from '../../../config/config.service';
import { UserInteractor } from '../../../utils/user-interactor.utility';

export class InstallUtilities {
  protected static checkPipInstallation(): boolean {
    try {
      execSync('pip --version', { stdio: 'pipe' });
      console.log('Pip is installed.');
    } catch (error) {
      console.error('Pip is not installed.');
      return false;
    }
    return true;
  }

  protected static installPipIfNotInstalled() {
    if (!this.checkPipInstallation()) {
      console.log('Trying to install pip..');
      try {
        execSync('sudo apt-get install python3-pip', { stdio: 'inherit' });
        console.log('Pip installed successfully.');
      } catch (installError) {
        console.error('Failed to install pip. Please install it manually.');
        process.exit(1);
      }
    }
  }

  static async checkSSHPassIntallation(): Promise<void> {
    const stdout = execSync('sshpass -V', { encoding: 'utf-8' });
    if (!stdout.includes('Shachar Shemesh')) {
      throw new Error(`Missing tool sshpass please install it!`);
    }
  }

  static async checkAnsibleInstallation(configService: ConfigService): Promise<void> {
    if (configService.getConfig()['ansible.checkedAnsibleIntall']) {
      return;
    }
    InstallUtilities.installPipIfNotInstalled();
    try {
      execSync('ansible --version', { stdio: 'pipe' });
      console.log('Ansible is installed.');
      configService.setConfigValue('ansible.checkedAnsibleIntall', true);
    } catch (error) {
      console.error('Ansible is not installed.');

      const answer = UserInteractor.prompt(
        'Do you want to install Ansible? (y/n): ',
        (input: string) => {
          return input === 'y' || input === 'n';
        }
      );
      if (answer.toLowerCase() === 'y') {
        try {
          console.log('Installing Ansible...');
          execSync('pip install ansible', { stdio: 'inherit' });
          console.log('Ansible installed successfully.');
        } catch (installError) {
          console.error(
            'Failed to install Ansible. Please install it manually.'
          );
          process.exit(1);
        }
      } else {
        console.log('Please install Ansible and try again.');
        process.exit(1);
      }
    }
  }

  static async checkForUpdates(configService: ConfigService) {
    const now = new Date();
    const lastUpdateCheck = new Date(
      configService.getConfig()['core.lastUpdateCheck']
    );
    const hoursSinceLastCheck =
      (now.getTime() - lastUpdateCheck.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastCheck >= 24) {
      console.log('Checking for updates...');

      configService.setConfigValue('core.lastUpdateCheck', now);
      try {
        const stdout = execSync('npm update -g @godcli/gcl', {
          encoding: 'utf-8',
        });
        console.log(`Successfully updated my-cli-tool: ${stdout}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error updating my-cli-tool: ${error.message}`);
        }
      }
    }
  }
}
