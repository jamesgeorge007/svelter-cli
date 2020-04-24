const execa = require("execa");
const fs = require("fs");
const path = require("path");
const enquirer = require("enquirer");
const ora = require("ora");

const copyDir = require("../utils/fs");

const projectScaffold = async (projectName) => {
  if (fs.existsSync(projectName)) {
    return;
  }

  const { templateOfChoice } = await enquirer.prompt({
    type: "select",
    name: "templateOfChoice",
    message: "Choose from below",
    choices: ["Svelte", "Sapper (SSR)"],
  });

  const source = path.resolve(__dirname, "..", "templates", "svelte");
  const dest = process.cwd();

  copyDir(source, dest);

  const renameFrom = path.join(dest, "svelte");
  const renameTo = path.join(dest, projectName);
  fs.renameSync(renameFrom, renameTo);

  let runScripts = {};
  let dependencies = [];

  runScripts = {
    build: "rollup -c",
    dev: "rollup -c -w",
    start: "sirv public",
  };
  dependencies = [
    "@rollup/plugin-commonjs",
    "@rollup/plugin-node-resolve",
    "rollup",
    "rollup-plugin-livereload",
    "rollup-plugin-svelte",
    "rollup-plugin-terser",
    "svelte",
    "sirv-cli",
  ];

  const pkgJsonPath = `${projectName}/package.json`;
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
  pkgJson.name = projectName;
  pkgJson.scripts = runScripts;

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  const spinner = ora("Installing dependencies").start();
  try {
    await execa.command(`npm install --save-dev ${dependencies.join(" ")}`, {
      cwd: projectName,
    });
  } catch (err) {
    spinner.fail("Something went wrong");
    throw err;
  }
  spinner.succeed("Done");
};

module.exports = projectScaffold;
