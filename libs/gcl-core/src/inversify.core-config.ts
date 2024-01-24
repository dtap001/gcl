import 'reflect-metadata';
import { Container } from 'inversify';
import { ConfigService } from './config';
import { DITypes } from './inversify.core-types';
import { PluginService } from './plugin/plugin.service';

export class DIConfig {
  public readonly container = new Container();
  constructor() {
    console.log('Inversify: Registering core types');
    this.container
      .bind<ConfigService>(DITypes.CORE_TYPES.ConfigService)
      .to(ConfigService)
      .inSingletonScope();
      this.container
      .bind<PluginService>(DITypes.CORE_TYPES.PluginService)
      .to(PluginService)
      .inSingletonScope();
  }
  init() {
    console.log('Inversify: Creating container');

    // DIConfig.container
    //   .bind<AddFolderCommand>(DIConfig.TYPES.AddFolderCommand)
    //   .to(AddFolderCommand);
    // DIConfig.container
    //   .bind<AnsibleRunCommand>(DIConfig.TYPES.AnsibleRunCommand)
    //   .to(AnsibleRunCommand);
    // DIConfig.container
    //   .bind<AddHostCommand>(DIConfig.TYPES.AddHostCommand)
    //   .to(AddHostCommand);
    // DIConfig.container
    //   .bind<ConfigCommand>(DIConfig.TYPES.ConfigCommand)
    //   .to(ConfigCommand);
  }

  // static addExtraConfig(extraTypes: any, registerAction: () => void) {
  //   DITypes.TYPES = {
  //     ...DITypes.TYPES,
  //     ...extraTypes,
  //   };
  //   console.log('Inversify: Registered extra types', extraTypes);
  //   registerAction();
  // }
}

export const DI = new DIConfig();
