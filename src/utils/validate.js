const execa = require("execa");

const hasYarn = () => {
  try {
    execa.commandSync("yarn --version");
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = hasYarn;
