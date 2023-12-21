#!/usr/bin/env node
import { Wrapper } from '@godcli/core';

console.log("Starting Example app");
async function run() {
  await new Wrapper().run(process.argv);
}
run();
