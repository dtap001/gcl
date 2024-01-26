import { UserInteractor } from '../../../utils/user-interactor.utility';
import { ConfigService } from '../../../config/config.service';
import { injectable, inject } from 'inversify';
import { GCLCommandOption, GCLCommand } from '../../../plugin/plugin.interface';
import { Logger } from '../../../utils/logging';
import { GCLDependencyCoreTypes } from '../../../inversify.core-types';

@injectable()
export class ConfigCommand implements GCLCommand {
  command = 'config';
  description =
    'by default it will print the current config. Use --edit to change it';
  options?: GCLCommandOption[] = [
    {
      name: 'edit',
      description: 'edit config',
      default: false,
    },
  ];

  constructor(
    @inject(GCLDependencyCoreTypes.VALUES.ConfigService) private configService: ConfigService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async action(options: {
    [x: string]: string | number | boolean;
  }): Promise<void> {
    const config = this.configService.getConfig();
    if (!options['edit']) {
      console.log(this.configService.getConfigPath());
      console.log(JSON.stringify(config), undefined, 0);
      return;
    }
    const result = await UserInteractor.selectFromList(
      'Select the configkey to change',
      this.configService.getKeys()
    );

    Logger.info(
      `Editing config key: ${result}\nCurrent value: '${config[result]}'.`
    );
    const newValue = UserInteractor.prompt(
      `Enter new value:`,
      () => true
    );

    if (newValue === null) return;

    this.configService.setConfigValue(result, newValue);
    console.log(`Updated ${result} to ${newValue}`);
  }
}
