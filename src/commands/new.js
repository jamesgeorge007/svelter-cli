const execa = require("execa");
const fs = require("fs");
const enquirer = require("enquirer");
const kleur = require("kleur");
const ora = require("ora");
const path = require("path");
const showBanner = require("node-banner");

const { description, name } = require("../../package");
const copyDir = require("../utils/fs");
const hasYarn = require("../utils/validate");

const projectScaffold = async (projectName, opts) => {
  await showBanner(name, description);

  if (fs.existsSync(projectName)) {
    console.error(
      kleur.red(`A directory with that name already exists in the current path`)
    );
    process.exit(1);
  }

  let packageManager = "npm";
  if (opts.useYarn && hasYarn()) {
    packageManager = "yarn";
  }

  const { templateOfChoice } = await enquirer.prompt({
    type: "select",
    name: "templateOfChoice",
    message: "Choose from below",
    choices: ["Svelte", "Sapper (SSR)"],
  });

  const templateDir = templateOfChoice === "Svelte" ? "svelte" : "sapper";

  const source = path.resolve(__dirname, "..", "templates", templateDir);
  const dest = process.cwd();

  copyDir(source, dest);

  const renameFrom = path.join(dest, templateDir);
  const renameTo = path.join(dest, projectName);
  fs.renameSync(renameFrom, renameTo);

  const pkgJsonPath = `${projectName}/package.json`;
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
  pkgJson.name = projectName;

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  const spinner = ora("Installing dependencies").start();
  try {
    await execa.command(`${packageManager} install`, {
      cwd: projectName,
    });
  } catch (err) {
    spinner.fail("Something went wrong");
    throw err;
  }
  spinner.succeed("Done");
  console.log(kleur.green(`\n Just couple of steps remaining`));
  console.log(
    kleur.cyan(`\n 1. cd ${projectName}\n 2. ${packageManager} run dev`)
  );
};

module.exports = projectScaffold;
