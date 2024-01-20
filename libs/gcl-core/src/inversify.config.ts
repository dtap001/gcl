import { Container } from 'inversify';
import { ConfigService } from './config/config.service';
import TYPES from './inversifiy.types';
import { PluginService } from './plugin/plugin.service';
import {
  AddFolderCommand,
  AddHostCommand,
  AnsibleRunCommand,
  ConfigCommand,
} from './plugins';

const container = new Container();
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
container.bind<PluginService>(TYPES.PluginService).to(PluginService).inSingletonScope();

container.bind<AddFolderCommand>(TYPES.AddFolderCommand).to(AddFolderCommand);
container
  .bind<AnsibleRunCommand>(TYPES.AnsibleRunCommand)
  .to(AnsibleRunCommand);
container.bind<AddHostCommand>(TYPES.AddHostCommand).to(AddHostCommand);

container.bind<ConfigCommand>(TYPES.ConfigCommand).to(ConfigCommand);

export default container;
