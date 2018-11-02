const levels_cfg = require("./levelsConfiguration");

let getMessageProperty, publishInDebugTab;

function onReceive(node, msg) {
  //console.log(`Custom onReceive\n${JSON.stringify(node)}\n${JSON.stringify(msg)}`);
  node.__duration = -new Date().getTime();
  const logging_cfg = getConfigForThisNode(node, "in");
  printData(node, msg, logging_cfg, "input");
}
  
function onSend(node, msg) {
  //console.log(`Custom onSend\n${msg}`);
  node.__duration += new Date().getTime();
  const logging_cfg = getConfigForThisNode(node, "out");
  printData(node, msg, logging_cfg, "output");
  delete node.__duration;
}


/**
 * Determine which is the configuration that applies for the node,
 * checking the configuration and trying to find the config according
 * to the type and ID of the current node
 * 
 * @param {Object} node As it is in the flow
 * @param {String} evt The event. It can be either "in" or "out"
 */
function getConfigForThisNode(node, evt) {
  let base_cfg = {};
  try {
    base_cfg = levels_cfg.config.logging.levels;
  }
  catch(e) {}
  
  let node_cfg = {
    "target": null,
    "data": null
  };

  let cfg_id = textFitsInRegularExpression(node.id, Object.keys(base_cfg.id));
  if (cfg_id && base_cfg.id[cfg_id][evt]) {
    node_cfg.target = base_cfg.id[cfg_id][evt].target;
    node_cfg.data = base_cfg.id[cfg_id][evt].data;
  }
  else {
    cfg_id = textFitsInRegularExpression(node.type, Object.keys(base_cfg.type));
    if (cfg_id && base_cfg.type[cfg_id][evt]) {
      node_cfg.target = base_cfg.type[cfg_id][evt].target;
      node_cfg.data = base_cfg.type[cfg_id][evt].data;
    }
  }

  node_cfg.target = node_cfg.target || base_cfg.default[evt].target;
  node_cfg.data = node_cfg.data || base_cfg.default[evt].data;

  return node_cfg;
}


/**
 * This function look for the first regular expression where the 'text' fits in
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


function printData(node, msg, logging_cfg, event_description) {
  const targets = (logging_cfg.target || "").split(",");
  const datas = (logging_cfg.data || "").split(",");
  datas.forEach((_data) => {
    const data = _data.trim();
    const value = data === "@duration" ? node.__duration : getFieldValue(node, msg, data);
    const message = {
      "_msgid": msg._msgid,
      "event": event_description,
      "key": data,
      "value": value || "-not defined-"
    };

    targets.forEach((_target) => {
      const target = _target.trim();
      if (target === "nodelog") {
        node.debug(JSON.stringify(message));
      }
      else if (target === "debugtab") {
        publishInDebugTab("debug", {
          "id": node.id,
          "format": "Object",
          "name": node.name,
          "msg": JSON.stringify(message),
          "topic": msg.topic || ""
        });
      }
    });
  });
}


/**
 * Retrieves a field from the context or message
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
 * @param {Function} fn It corresponds to RED.util.getMessageProperty function
 */
function setFnGetMessageProperty(fn) {
  getMessageProperty = fn;
}

/**
 * Function to be called from the _log4nr.js_
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
