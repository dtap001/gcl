#!/usr/bin/env node
import { Wrapper } from '@godcli/core';

async function run() {
  const plugins = [
    {
      command: 'myCustomComand',
      description: 'My command description',
      action: async () => {
        console.log(process.env['npm_package_version'] || '0.0.0');
      },
    },
  ];

  await new Wrapper().run(process.argv, plugins);
}
run();
