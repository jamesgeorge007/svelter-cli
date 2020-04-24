const execa = require("execa");
const fs = require("fs");
const path = require("path");
const enquirer = require("enquirer");
const ora = require("ora");

const { copyFile, copyDir } = require("../utils/fs");

const projectScaffold = async (projectName) => {
  if (fs.existsSync(projectName)) {
    return;
  }

  /* const { templateOfChoice } = await enquirer.prompt({
    type: "select",
    name: "templateOfChoice",
    message: "Choose from below",
    choices: ["Svelte", "Sapper (SSR)"],
  }); */

  const { bundlerOfChoice } = await enquirer.prompt({
    type: "select",
    name: "bundlerOfChoice",
    message: "Choose the module bundler of your choice:",
    choices: ["webpack", "Rollup"],
  });

  const dirSource = path.resolve(__dirname, "..", "templates", "svelte");
  const dirDest = process.cwd();

  copyDir(dirSource, dirDest);

  const renameFrom = path.join(dirDest, "svelte");
  const renameTo = path.join(dirDest, projectName);
  fs.renameSync(renameFrom, renameTo);

  const configFilePath =
    bundlerOfChoice === "webpack"
      ? ["webpack", "webpack.config.js"]
      : ["rollup", "rollup.config.js"];

  const fileSource = path.resolve(
    __dirname,
    "..",
    "templates",
    "bundler",
    ...configFilePath
  );
  const fileDest = path.resolve(process.cwd(), projectName);

  copyFile(fileSource, fileDest);

  let runScripts = {};
  let dependencies = [];

  if (bundlerOfChoice === "webpack") {
    runScripts = {
      build: "cross-env NODE_ENV=production webpack",
      dev: "webpack-dev-server --content-base public",
    };
    dependencies = [
      "cross-env",
      "css-loader",
      "mini-css-extract-plugin",
      "serve",
      "style-loader",
      "svelte-loader",
      "webpack",
      "webpack-cli",
      "webpack-dev-server",
    ];
  } else {
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
      "sirv-cli",
    ];
  }

  const pkgJsonPath = `${projectName}/package.json`;
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
  pkgJson.name = projectName;
  pkgJson.scripts = runScripts;

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  const spinner = ora("Installing dependencies").start();
  try {
  	await execa.command(`npm install --save-dev ${dependencies.join(' ')}`);
  } catch (err) {
  	spinner.fail('Something went wrong');
  	throw err;
  }
  spinner.succeed('Done');
};

module.exports = projectScaffold;
