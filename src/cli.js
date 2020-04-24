const program = require("commander");

const projectScaffold = require("./commands/new");

const { version } = require("../package");

program.version(version).usage("<command> [options]");

program
  .command("new <name>")
  .option("--use-yarn")
  .description("Scaffold a svelte/sapper project")
  .action(projectScaffold);

// parse args
program.parse(process.argv);
