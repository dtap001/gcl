#!/usr/bin/env node
console.log(111111111111);
 import { DIConfig, Wrapper } from '@godcli/core';
import { MyPlugin } from './my-plugin/my.plugin';
 //import { MyPlugin } from './my-plugin/my.plugin';

async function run() {
  console.log('run');
  //DIConfig.init();
  await new Wrapper().run(process.argv, [new MyPlugin()]);
}

 run();
