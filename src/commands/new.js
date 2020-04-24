const { prompt } = require("enquirer");

const projectScaffold = async () => {
  const { choice } = await prompt({
    type: "select",
    name: "choice",
    message: "Choose from below",
    choices: ["Svelte", "Sapper (SSR)"],
  });

  console.log(choice);
};

module.exports = projectScaffold;
