const execa = require("execa");
const fs = require("fs");
const kleur = require("kleur");
const ora = require("ora");
const showBanner = require("node-banner");

const { description, name } = require("../../package");
const hasYarn = require("../utils/validate");
const selectPrompt = require("../utils/prompt");

/**
 * Creates an initial local commit
 * @param {string} projectName - source directory path
 *
 * @returns {Void}
 */

const makeInitialCommit = (projectName) => {
  // Commands to be executed serially
  const commands = ["init", "add .", `commit -m "Init"`];

  // Execute commands serially
  commands.forEach((cmd) =>
    execa.sync("git", cmd.split(" "), { cwd: projectName })
  );
};

/**
 * Scaffold Svelte/Sapper project
 * @param {string} projectName - source directory path
 * @param {Object} opts - path to the destination directory
 * @returns {Promise<void>}
 */

const scaffoldProject = async (projectName, opts) => {
  await showBanner(name, description);

  if (fs.existsSync(projectName)) {
    console.error(
      kleur.red(`A directory with that name already exists in the current path`)
    );
    process.exit(1);
  }

  // --use-yarn flag resolution
  let packageManager = "npm";
  if (opts.useYarn && hasYarn()) {
    packageManager = "yarn";
  }

  let templateOfChoice = "Svelte";
  let bundlerOfChoice = "webpack";

  // Choose between Svelte/Sapper
  try {
    ({ userChoice: templateOfChoice } = await selectPrompt(
      "Choose from below",
      ["Svelte", "Sapper (SSR)"]
    ));
  } catch (err) {
    console.error(kleur.red("Interrupted"));
    process.exit(1);
  }

  // Pick your module bundler of choice
  try {
    ({
      userChoice: bundlerOfChoice,
    } = await selectPrompt("Please pick a module bundler", [
      "webpack",
      "rollup",
    ]));
  } catch (err) {
    console.error(kleur.red("Interrupted"));
    process.exit(1);
  }

  let templateRepoUrl = "https://github.com/sveltejs/template";
  let shellCmd = "";

  if (templateOfChoice === "Svelte") {
    if (bundlerOfChoice === "webpack") {
      templateRepoUrl = `${templateRepoUrl}-webpack`;
    }
    shellCmd = `git clone ${templateRepoUrl} ${projectName}`;
  } else {
    // User chose Sapper
    templateRepoUrl = "https://github.com/sveltejs/sapper-template";
    shellCmd = `git clone ${templateRepoUrl} --branch ${bundlerOfChoice} --single-branch ${projectName}`;
  }

  const spinner = ora("Fetching the starter template").start();

  // Clone the respective template repository
  await execa.command(shellCmd);

  // Delete .git directory
  fs.rmdirSync(`${projectName}/.git`, { recursive: true });

  // Update package.json
  const pkgJsonPath = `${projectName}/package.json`;
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
  pkgJson.name = projectName;

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  // Install project dependencies
  spinner.text = "Installing dependencies";
  try {
    await execa.command(`${packageManager} install`, {
      cwd: projectName,
    });
  } catch (err) {
    spinner.fail("Something went wrong");
    throw err;
  }

  makeInitialCommit(projectName);

  spinner.succeed(`You're all set`);

  // Final instructions
  console.log(kleur.green(`\n Just couple of steps remaining`));
  console.log(
    kleur.cyan(`\n 1. cd ${projectName}\n 2. ${packageManager} run dev`)
  );
};

module.exports = scaffoldProject;
