const connector = require("./connector");
const log_levels = require("./logLevels");

// these function will contain the reference to some RED functions
let each_node_fn, get_node_fn;

/**
 * Update all nodes in the flows, modifying the metric function in order
 * to control the "send" and "receive" events
 */
function updateNodes() {
  console.log("Updating nodes after a flows deployment...");
  let counter=0;
  each_node_fn((node) => {
    //console.log(node);
    const node_object = get_node_fn(node.id) || {on: function(){}};
    const source_metric = node_object.metric;
    node_object.metric = function(eventname, msg, metricValue) {
      if (eventname && eventname === "receive") {
        log_levels.onReceive(node_object, msg);
      }
      else if (eventname && eventname === "send") {
        log_levels.onSend(node_object, msg);
      }
      source_metric(eventname, msg, metricValue);
    }
    counter++;
  });
  console.log(`${counter} nodes updated after the flows deployment`);
}


// connects the function we want to execute when a deployment is done
connector.initDeployFunction(updateNodes);


module.exports = function(RED) {
  // save the reference to some RED functions
  each_node_fn = RED.nodes.eachNode;
  get_node_fn = RED.nodes.getNode;
  // sent this function reference, in order to be able to retrieve information from the message object
  log_levels.setFnGetMessageProperty(RED.util.getMessageProperty);
  // sent this function reference, in order to be able to publish in the debug tab
  // function defined in node-red\red\api\editor\comms.js
  log_levels.setFnPublishInDebugTab(RED.comms.publish);
}
