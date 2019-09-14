#!/usr/bin/env node

require("yargs")
  .option("dir", { alias: "d", description: "directory where posts live" })
  .command(require("./commands/posts"))
  .command(require("./commands/postStats"))
  .demandCommand()
  .help().argv;
