const levels_cfg = require("./levelsConfiguration");

// RED.util.getMessageProperty
let getMessageProperty,
// RED.comms.publish
  publishInDebugTab;


/**
 * Additional functionality to attach when entering in a node
 * 
 * @param {Object} node the node that is starting the execution
 * @param {Object} msg  the message that arrived
 */
function onReceive(node, msg) {
  // set an initial duration
  node.__duration = -new Date().getTime();
  const logging_cfg = getConfigForThisNode(node, "in");
  printData(node, msg, logging_cfg, "input");
}
  
/**
 * Additional functionality to attach when exiting from a node
 * 
 * @param {Object} node the node that is finishing the execution
 * @param {Object} msg  the message that goes out
 */
function onSend(node, msg) {
  // update the duration
  node.__duration += new Date().getTime();
  const logging_cfg = getConfigForThisNode(node, "out");
  printData(node, msg, logging_cfg, "output");
  delete node.__duration;
}


/**
 * Determine which is the configuration that applies for the node,
 * checking the configuration and trying to find the config according
 * to the type and ID of the current node, or using the default one
 * 
 * @param {Object} node As it is in the flow
 * @param {String} evt The event. It can be either "in" or "out"
 */
function getConfigForThisNode(node, evt) {
  let base_cfg = {};
  try {
    base_cfg = levels_cfg.config.logging.levels;
    base_cfg.default = base_cfg.default || {};
  }
  catch(e) {
    node.warn(`The log4nr configuration seems not to be correct`, e);
  }
  
  // initialize the data with the default values that apply to every node
  let node_cfg = {
    "target": (base_cfg.default[evt] || {}).target,
    "data": (base_cfg.default[evt] || {}).data
  };

  // let's update in case there's a configuration by type that applies
  let cfg_id = textFitsInRegularExpression(node.type, Object.keys(base_cfg.type));
  if (cfg_id && base_cfg.type[cfg_id][evt]) {
    node_cfg.target = base_cfg.type[cfg_id][evt].target ? base_cfg.type[cfg_id][evt].target : node_cfg.target;
    node_cfg.data = base_cfg.type[cfg_id][evt].data ? base_cfg.type[cfg_id][evt].data : node_cfg.data;
  }

  // let's update in case there's a configuration by id that applies
  cfg_id = textFitsInRegularExpression(node.id, Object.keys(base_cfg.id));
  if (cfg_id && base_cfg.id[cfg_id][evt]) {
    node_cfg.target = base_cfg.id[cfg_id][evt].target ? base_cfg.id[cfg_id][evt].target : node_cfg.target;
    node_cfg.data = base_cfg.id[cfg_id][evt].data ? base_cfg.id[cfg_id][evt].data : node_cfg.data;
  }

  return node_cfg;
}


/**
 * This function look for the first regular expression where the 'text' fits in
 * 
 * @param {String} text 
 * @param {Array of String} listOfRegExp 
 */
function textFitsInRegularExpression(text, listOfRegExp) {
  let found=false, i=0, rtn;
  while (i<listOfRegExp.length && !found) {
    let re = new RegExp(listOfRegExp[i]);
    if (re.test(text)) {
      rtn = listOfRegExp[i];
      found = true;
    }
    i++;
  }
  return rtn;
}


/**
 * Prints the node's data to it corresponds
 * 
 * @param {*} node the node that is being executed in the moment
 * @param {*} msg the message in that moment
 * @param {*} logging_cfg the logging configuration related to the node
 * @param {*} event_description input/output
 */
function printData(node, msg, logging_cfg, event_description) {
  const targets = (logging_cfg.target || "").split(",");
  const datas = (logging_cfg.data || "").split(",");

  // preparing the message to be printed
  let message = {
    "_msgid": msg._msgid,
    "event": event_description,
    "data": {}
  };

  datas.forEach((_data) => {
    const data = _data.trim();
    const value = data === "@duration" ? node.__duration : getFieldValue(node, msg, data);
    message.data[data] = value;
  });

  targets.forEach((_target) => {
    const target = _target.trim();
    if (target === "nodedebug") {
      // prints in the standard logging
      node.debug(JSON.stringify(message));
    }
    else if (target === "debugtab") {
      // publish the information to the debug tab
      publishInDebugTab("debug", {
        "id": node.id,
        "format": "Object",
        "name": node.name,
        "msg": JSON.stringify(message),
        "topic": msg.topic || ""
      });
    }
    else if (target === "nodemetric") {
      // send the information as metric
      node.metric("log4nr", msg, message);
    }
  });
}


/**
 * Retrieves a field from the context (global or flow) or message
 * 
 * @param {Object} node 
 * @param {Object} msg 
 * @param {String} dataPath 
 */
function getFieldValue(node, msg, dataPath) {
  const _dataPath = dataPath || "unknown.";
  const regexp = _dataPath.match(/^([^\.]+)\./);
  const contextType = regexp ? regexp[1] : "";
  const field = _dataPath.substring(contextType.length+1);

  if (contextType === "msg") {
    return getMessageProperty(msg, field);
  }
  else if (contextType === "flow") {
    return node.context().flow.get(field);
  }
  else if (contextType === "global") {
    return node.context().global.get(field);
  }
  else {
    return undefined;
  }
}


/**
 * Function to be called from the _log4nr.js_
 * 
 * @param {Function} fn It corresponds to RED.util.getMessageProperty function
 */
function setFnGetMessageProperty(fn) {
  getMessageProperty = fn;
}

/**
 * Function to be called from the _log4nr.js_
 * 
 * @param {Function} fn It corresponds to RED.comms.publish function
 */
function setFnPublishInDebugTab(fn) {
  publishInDebugTab = fn;
}



module.exports = {
  "onReceive": onReceive,
  "onSend": onSend,
  "setFnGetMessageProperty": setFnGetMessageProperty,
  "setFnPublishInDebugTab": setFnPublishInDebugTab
}
