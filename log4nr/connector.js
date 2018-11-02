
let function_to_call_when_there_is_a_deploy;
let fns = {};

function initDeployFunction(callback) {
  function_to_call_when_there_is_a_deploy = callback;
}

function execDeployFunction() {
  function_to_call_when_there_is_a_deploy && function_to_call_when_there_is_a_deploy();
  //fns.execDeploy && fns.execDeploy();
}

function test() {
  console.log("test");
}

module.exports = {
  "initDeployFunction": initDeployFunction,
  "execDeployFunction": execDeployFunction
}
