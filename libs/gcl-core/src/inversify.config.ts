import { Container } from 'inversify';
import { ConfigService } from './config/config.service';
import {
  AddFolderCommand,
  AddHostCommand,
  AnsibleRunCommand,
  ConfigCommand,
} from './plugins';
import { PluginService } from './plugin/plugin.service';

console.log('Inversify: Creating container');
const container = new Container();
let TYPES = {
  PluginService: Symbol('PluginService'),
  ConfigService: Symbol('ConfigService'),
  AddFolderCommand: Symbol('AddFolderCommand'),
  AnsibleRunCommand: Symbol('AnsibleRunCommand'),
  AddHostCommand: Symbol('AddHostCommand'),
  ConfigCommand: Symbol('ConfigCommand'),
};

console.log('Inversify: Registered default types', TYPES);
container
  .bind<ConfigService>(TYPES.ConfigService)
  .to(ConfigService)
  .inSingletonScope();
container
  .bind<PluginService>(TYPES.PluginService)
  .to(PluginService)
  .inSingletonScope();

container.bind<AddFolderCommand>(TYPES.AddFolderCommand).to(AddFolderCommand);
container
  .bind<AnsibleRunCommand>(TYPES.AnsibleRunCommand)
  .to(AnsibleRunCommand);
container.bind<AddHostCommand>(TYPES.AddHostCommand).to(AddHostCommand);
container.bind<ConfigCommand>(TYPES.ConfigCommand).to(ConfigCommand);

function addExtraConfig(extraTypes: Record<string, symbol>, registerAction: () => void) {
  // iterate over extraTypes and add them to TYPES
  for (const key of Object.keys(extraTypes)) {
    TYPES[key] = extraTypes[key];
  }
  console.log('Inversify: Registered extra types', extraTypes);
  registerAction();
}


export { container, TYPES, addExtraConfig };
