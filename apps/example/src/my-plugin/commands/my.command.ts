import {
  ConfigService,
  GCLCommand,
  GCLDependencyCoreTypes,
} from '@godcli/core';
import { inject, injectable } from 'inversify';
import { MyPLuginConfig } from '../my.config';

@injectable()
export class MyCommand implements GCLCommand {
  constructor(
    @inject(GCLDependencyCoreTypes.VALUES.ConfigService)
    private configService: ConfigService
  ) {}

  command = 'myCommand';
  description = 'my command description';
  action = async (options) => {
    console.log('my command action');
    this.configService.setConfigValue<MyPLuginConfig>(
      'myPlugin.my-config-key',
      options.myOption
    );
    options = [
      {
        name: 'myOption',
        description: 'my option description',
        default: 'my default value',
      },
    ];
  };
}
