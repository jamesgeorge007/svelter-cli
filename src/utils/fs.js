const fs = require("fs");
const path = require("path");
/**
 * Copy files
 * @param {any} source - source directory path
 * @param {any} target - path to the destination directory
 * @returns {Void}
 */

const copyFile = (source, target) => {
  let targetFile = target;

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

/**
 * Copy directory content recursively
 * @param {any} source - source directory path
 * @param {any} target - path to the destination directory
 * @returns {Void}
 */
const copyDir = (source, target) => {
  // check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    fs.readdirSync(source).forEach((file) => {
      let curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyDir(curSource, targetFolder);
      } else {
        copyFile(curSource, targetFolder);
      }
    });
  }
};

module.exports = copyDir;
