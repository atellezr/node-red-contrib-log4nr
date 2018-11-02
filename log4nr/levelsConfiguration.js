const extend = require("extend");

let cfg = {
  "logging": {
    "levels": {
      "default": {
        "in": {
          "target": "nodelog,debugtab",
          "data": "msg.payload,msg.headers"
        },
        "out": {
          "target": "nodelog,debugtab",
          "data": "msg.payload,msg.headers,@duration"
        }
      },
      "type": {},
      "id": {}
    }
  }
};

function updateCfg(config_extension) {
  cfg = extend(true, cfg, config_extension);
}

function setCfg(complete_config) {
  cfg = extend(true, {}, complete_config);
}

module.exports = {
  "config": cfg,
  "update": updateCfg,
  "set": setCfg
}
