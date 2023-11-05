#!/usr/bin/env node
import { Wrapper } from '@gcl/gcl-core';

async function run() {
  await new Wrapper().run(process.argv);
}
run();
