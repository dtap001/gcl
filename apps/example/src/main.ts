#!/usr/bin/env node
import { Wrapper } from '@godcli/core';
async function run() {
  await new Wrapper().run(process.argv);
}
run();
