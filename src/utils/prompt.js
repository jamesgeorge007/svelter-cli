const enquirer = require("enquirer");
const kleur = require("kleur");

/**
 * Shows up select prompt
 * @param {string} message - The message to show up
 * @param {string} message - Available choices
 *
 * @returns {Promise<string>}
 */

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
