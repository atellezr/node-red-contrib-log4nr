/*
Example of a log of starting an application:

7 Nov 10:28:40 - [info]

Welcome to Node-RED
===================

7 Nov 10:28:40 - [info] Node-RED version: v0.18.3
7 Nov 10:28:40 - [info] Node.js  version: v8.9.4
7 Nov 10:28:40 - [info] Windows_NT 6.1.7601 x64 LE
7 Nov 10:28:40 - [info] Palette editor disabled : npm command not found
7 Nov 10:28:40 - [info] Loading palette nodes
7 Nov 10:28:48 - [warn] ------------------------------------------------------
7 Nov 10:28:48 - [warn] [node-red/rpi-gpio] Info : Ignoring Raspberry Pi specific node
7 Nov 10:28:48 - [warn] [node-red/tail] Not currently supported on Windows.
7 Nov 10:28:48 - [warn] ------------------------------------------------------
7 Nov 10:28:48 - [info] Settings file  : settings.js
7 Nov 10:28:48 - [info] User directory : .node-red
7 Nov 10:28:48 - [warn] Projects disabled : set editorTheme.projects.enabled=true to enable
7 Nov 10:28:48 - [info] Flows file     : flows_alvaro.json
7 Nov 10:28:48 - [info] Server now running at http://127.0.0.1:1880/
7 Nov 10:28:48 - [debug] loaded flow revision: 001914cc4a5bcc3242a90205cdaaaaaa
7 Nov 10:28:48 - [debug] red/runtime/nodes/credentials.load : user disabled encryption
7 Nov 10:28:48 - [debug] red/runtime/nodes/credentials.load : keyType=disabled
7 Nov 10:28:48 - [trace] runtime event: {"id":"runtime-state","retain":true}
7 Nov 10:28:48 - [trace] runtime event: {"id":"runtime-deploy","payload":{"revision":"001914cc4a5bcc3242a90205cdaaaaaa"},"retain":true}
A flows deployment has been done!
Updating nodes after a flows deployment...
207 nodes updated after the flows deployment
7 Nov 10:28:48 - [info] Starting flows
7 Nov 10:28:48 - [debug] red/nodes/flows.start : starting flow : global
7 Nov 10:28:48 - [debug] red/nodes/flows.start : starting flow : 1e5cd0fd.aaaaaa
7 Nov 10:28:48 - [debug] red/nodes/flows.start : starting flow : 6f2909b1.aaaaaa
7 Nov 10:28:48 - [debug] red/nodes/flows.start : starting flow : 3b54c060.aaaaaa
7 Nov 10:28:48 - [debug] red/nodes/flows.start : starting flow : 2f879cf0.aaaaaa
7 Nov 10:28:48 - [debug] red/nodes/flows.start : starting flow : 150dd7bf.aaaaaa
7 Nov 10:28:48 - [debug] red/nodes/flows.start : starting flow : e98406e6.aaaaaa
7 Nov 10:28:48 - [trace] runtime event: {"id":"runtime-state","retain":true}
7 Nov 10:28:48 - [info] Started flows
Updating nodes after a flows deployment...
207 nodes updated after the flows deployment

There's a "runtime-deploy" event before the flows started, and because of that it is needed to
do the checks with the interval and timeout, in order to ensure that there's an update nodes
after the flows are ready
*/

let function_to_call_when_there_is_a_deploy;
let fns = {};
let is_done_first_deployment = false;

/**
 * Setting which will be the function to be called once a flows deployment is done
 * 
 * @param {Function} callback 
 */
function initDeployFunction(callback) {
  // let's save for the future the function where to call when a flows deployment is done
  function_to_call_when_there_is_a_deploy = callback;

  // in addition, let's check every second if the first flow deployment (flows loading when
  // starting the application) is done, and call the function then
  let interval = setInterval(function(){
    // first execution, once everything is loaded
    if (is_done_first_deployment) {
      clearInterval(interval);
      function_to_call_when_there_is_a_deploy();
    }
  }, 1000);
}

/**
 * Executes the function when the flows deployment is done
 */
function execDeployFunction() {
  !is_done_first_deployment && setTimeout(function(){
    is_done_first_deployment = true;
    // assuming the flows loading will be completed after 1 second after the event
    // was raised
  }, 1000);

  function_to_call_when_there_is_a_deploy && function_to_call_when_there_is_a_deploy();
}


module.exports = {
  "initDeployFunction": initDeployFunction,
  "execDeployFunction": execDeployFunction
}
