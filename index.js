const logHandler = require("./log4nr/logHandler");
const levelsConfiguration = require("./log4nr/levelsConfiguration");

module.exports = {
  "logHandler": logHandler,
  "getConfig": function(){return levelsConfiguration.config},
  "setLoggingConfiguration": levelsConfiguration.set,
  "updateLoggingConfiguration": levelsConfiguration.update
}
