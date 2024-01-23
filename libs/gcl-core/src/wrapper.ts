import { InstallUtilities } from './plugins/ansible/utils/install.utilities';
import { Command } from 'commander';
import { UserInteractor } from './utils';
import { GCLPlugin } from './plugin/plugin.interface';
import { PluginService } from './plugin/plugin.service';
import { ConfigService } from './config';
import { injectable } from 'inversify';
import TYPES from './inversifiy.types';
import container from './inversify.config';
import { AnsiblePlugin } from './plugins/ansible/ansible.plugin';
import { CorePlugin } from './plugins/core/core.plugin';

@injectable()
export class Wrapper {
  private pluginService = container.get<PluginService>(TYPES.PluginService);
  private configService = container.get<ConfigService>(TYPES.ConfigService);

  async run(args: string[], plugins: GCLPlugin[]): Promise<void> {
    const command = new Command();

    this.pluginService.registerPlugin(new CorePlugin(), command);
    this.pluginService.registerPlugin(new AnsiblePlugin(), command);

    plugins.forEach((plugin) => {
      this.pluginService.registerPlugin(plugin, command);
    });

    if (args.length === 2) {
      await this.handleWhenNoCommandSelected(args, command);
    }

    command.showSuggestionAfterError(true);

    await InstallUtilities.checkForUpdates(this.configService);
    await InstallUtilities.checkAnsibleInstallation(this.configService);
    // await InstallUtilities.checkSSHPassIntallation().catch((err) => {
    //   console.error(`Failed to continue. Please fix ${err.message}`);
    //   exit();
    // });

    await command.parseAsync(args);
  }

  private async handleWhenNoCommandSelected(args: string[], command: Command) {
    const separator = ` => `;
    const commands = command.commands.map(
      (cmd) => `${cmd.name()}${separator}${cmd.description()}}`
    );
    const result = await UserInteractor.selectFromList(
      `Which command would you like to run run?`,
      commands
    );
    const commandRealName = result.split(separator)[0];
    args.push(commandRealName);
  }
}
