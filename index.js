const logHandler = require("./log4nr/logHandler");
const levelsConfiguration = require("./log4nr/levelsConfiguration");

module.exports = {
  "logHandler": logHandler,
  "setLoggingConfiguration": levelsConfiguration.set,
  "updateLoggingConfiguration": levelsConfiguration.update
}
