#!/usr/bin/env node
import { Wrapper } from '@godcli/wrapper';
import { MyPlugin } from './my-plugin/my.plugin';

async function run() {
  await new Wrapper().run(process.argv, [new MyPlugin()]);
}

run();
