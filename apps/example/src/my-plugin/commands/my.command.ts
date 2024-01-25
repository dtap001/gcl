import { ConfigService, DITypes, GCLCommand } from '@godcli/core';
import { inject, injectable } from 'inversify';

@injectable()
export class MyCommand implements GCLCommand {
  constructor(
    @inject(DITypes.CORE_TYPES.ConfigService)
    private configService: ConfigService
  ) {}

  command = 'myCommand';
  description = 'my command description';
  action = async (options) => {
    console.log('my command action');
  };
  options = [
    {
      name: 'myOption',
      description: 'my option description',
      default: 'my default value',
    },
  ];
}
