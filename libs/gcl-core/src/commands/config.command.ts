import { UserInteractor } from '../utils/user-interactor.utility';
import { Configuration } from '../config/config';

export class ConfigCommand {
  async run(editMode: boolean) {
    const config = Configuration.getConfig();
    if (!editMode) {
      console.log(Configuration.getConfigPath())
      console.log(JSON.stringify(config), undefined, 0);
      return;
    }
    const configKeys = Object.keys(config);
    const result = await UserInteractor.selectFromList('Select the configkey to change', configKeys);
    console.log(`ANSWER: ${JSON.stringify(result)}`);



    const newValue = UserInteractor.prompt(
      `Enter value for: ${config[result]}`,
      () => true
    );

    if (newValue === null) return;

    Configuration.setConfigValue(result, newValue);
    console.log(`Updated ${result} to ${newValue}`);
  }
}
