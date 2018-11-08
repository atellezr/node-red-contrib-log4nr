const extend = require("extend");

/**
 * Default configuration that can be updated afterwards
 */
let cfg = {
  "logging": {
    "levels": {
      // the default configuration that will apply to all the nodes except another rule overwrite it
      "default": {
        "in": {
          "target": "",
          "data": ""
        },
        "out": {
          "target": "nodedebug",
          "data": "@duration"
        }
      },
      "type": {
        // in the "catch" we want to show the error object in the log and in the tab
        "catch": {
          "in": {
            "target": "nodedebug,debugtab",
            "data": "msg.error"
          },
          "out": {
            "target": "",
            "data": ""
          }
        },
        // the entering nodes for the HTTP requests
        "http in": {
          "in": {
            "target": "",
            "data": ""
          },
          "out": {
            "target": "nodedebug",
            "data": "msg.req.originalUrl,msg.req.query,msg.req.params"
          }
        },
        // the ending of a HTTP request
        "http response": {
          "in": {
            "target": "nodedebug",
            //"target": "",
            "data": "msg.payload"
          },
          "out": {
            "target": "",
            "data": ""
          }
        },
        // node for calling to an URL
        "http request": {
          "in": {
            "target": "nodedebug",
            "data": "msg.payload,msg.url"
          },
          "out": {
            "target": "nodedebug",
            "data": "msg.payload"
          }
        }
      },
      "id": {}
    }
  }
};


/**
 * Extend the current configuration with the input object
 * @param {json} config_extension 
 */
function updateCfg(config_extension) {
  cfg = extend(true, cfg, config_extension);
}

/**
 * Set the configuration to the input one
 * @param {json} complete_config 
 */
function setCfg(complete_config) {
  cfg = extend(true, {}, complete_config);
}



module.exports = {
  "config": cfg,
  "update": updateCfg,
  "set": setCfg
}
