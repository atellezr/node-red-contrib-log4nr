const connector = require("./connector");

function logAnalyzer(settings) {
  return function(msg) {
    //console.log(`mi log handler: ${msg.level}\n${JSON.stringify(msg)}`);
    //console.log(`${JSON.stringify(msg)}`);
    if (msg.level === 60 && msg.msg.startsWith("runtime event")) {
      //console.log(msg.msg);
      const evt = JSON.parse(msg.msg.replace("runtime event: ", ""));
      if (evt.id === "runtime-deploy") {
        console.log("A deploy has been done!");
        connector.execDeployFunction();
      }
    }
  }
}


module.exports = {
  "level": "trace",
  "metrics": false,
  "audit": false,
  "handler": logAnalyzer
}
