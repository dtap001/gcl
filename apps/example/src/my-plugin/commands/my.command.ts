import { GCLCommand } from "@godcli/core";

export class MyCommand implements GCLCommand {
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
