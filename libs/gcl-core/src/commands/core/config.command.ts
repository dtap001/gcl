import { UserInteractor } from '../../utils/user-interactor.utility';
import { ConfigService } from '../../config/config.service';
import { injectable, inject } from 'inversify';
import TYPES from '../../inversifiy.types';

@injectable()
export class ConfigCommand {
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService
  ) {}

  async run(editMode: boolean) {
    const config = this.configService.getConfig();
    if (!editMode) {
      console.log(this.configService.getConfigPath());
      console.log(JSON.stringify(config), undefined, 0);
      return;
    }
    const result = await UserInteractor.selectFromList(
      'Select the configkey to change',
      this.configService.getKeys()
    );
    console.log(`ANSWER: ${JSON.stringify(result)}`);

    const newValue = UserInteractor.prompt(
      `Enter value for: ${config[result]}`,
      () => true
    );

    if (newValue === null) return;

    this.configService.setConfigValue(result, newValue);
    console.log(`Updated ${result} to ${newValue}`);
  }
}
