const program = require("commander");

const scaffoldProject = require("./commands/new");

const { version } = require("../package");

program.version(version).usage("<command> [options]");

program
  .command("new <name>")
  .option("--use-yarn")
  .description("Scaffolds a svelte/sapper project")
  .action(scaffoldProject);

// parse args
program.parse(process.argv);
