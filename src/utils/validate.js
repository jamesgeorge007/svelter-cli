const execa = require("execa");

/**
 * Check for yarn installation
 * @returns {Boolean}
 */
const hasYarn = () => {
  try {
    execa.commandSync("yarn --version");
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = hasYarn;
