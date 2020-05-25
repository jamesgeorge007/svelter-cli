const enquirer = require("enquirer");
const kleur = require("kleur");

const selectPrompt = (message, choices) => {
  try {
    return enquirer.prompt({
      type: "select",
      name: "userChoice",
      message,
      choices,
    });
  } catch (err) {
    console.error(kleur.red("Interrupted"));
    process.exit(1);
  }
};

module.exports = selectPrompt;
