import 'reflect-metadata';
import { Container } from 'inversify';
import { ConfigService } from './config';
import { GCLDependencyCoreTypes } from './inversify.core-types';
import { PluginService } from './plugin/plugin.service';

export class GCLDependencyInjection {
  public readonly container = new Container();
  constructor() {
    console.log('Inversify: Registering core types');
    this.container
      .bind<ConfigService>(GCLDependencyCoreTypes.VALUES.ConfigService)
      .to(ConfigService)
      .inSingletonScope();
      this.container
      .bind<PluginService>(GCLDependencyCoreTypes.VALUES.PluginService)
      .to(PluginService)
      .inSingletonScope();
  }
}

export const DI = new GCLDependencyInjection();
