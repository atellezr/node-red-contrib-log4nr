const connector = require("./connector");

/**
 * It analyzes the log events and when the "runtime event" called "runtime-deploy" happens
 * it'll call the connected function that will take care of the deployments
 * 
 * @param {Object} settings The logging configuration
 */
function logAnalyzer(settings) {
  return function(msg) {
    // LEVEL 60=TRACE
    if (msg.level === 60 && msg.msg.startsWith("runtime event")) {
      //console.log(msg.msg);
      const evt = JSON.parse(msg.msg.replace("runtime event: ", ""));
      if (evt.id === "runtime-deploy") {
        console.log("A flows deployment has been done!");
        connector.execDeployFunction();
      }
    }
  }
}


// the exported object is the one to be set in the node-red's settings.js
// it includes all the attributes that it has to have
module.exports = {
  "level": "trace",
  "metrics": false,
  "audit": false,
  "handler": logAnalyzer
}
