const fs = require("fs");
const path = require("path");
const { prompt } = require("enquirer");

const { copyFile, copyDir } = require("../utils/fs");

const projectScaffold = async (projectName) => {
  if (fs.existsSync(projectName)) {
    return;
  }

  /* const { templateOfChoice } = await prompt({
    type: "select",
    name: "templateOfChoice",
    message: "Choose from below",
    choices: ["Svelte", "Sapper (SSR)"],
  }); */

  const { bundlerOfChoice } = await prompt({
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
};

module.exports = projectScaffold;
