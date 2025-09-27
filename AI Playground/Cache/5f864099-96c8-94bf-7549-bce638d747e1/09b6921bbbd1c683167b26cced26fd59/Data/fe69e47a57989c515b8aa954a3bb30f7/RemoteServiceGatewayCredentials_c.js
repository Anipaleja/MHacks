if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input string apiToken = "[PUT YOUR SNAP API TOKEN HERE]" {"label":"Snap API Token"}
// @ui {"widget":"label", "label":"<span style=\"color: red;\">⚠️ Do not include your API token when sharing or uploading this project to version control.</span>"}
// @ui {"widget":"label", "label":"For setup instructions, please visit: <a href=\"https://developers.snap.com/spectacles/about-spectacles-features/apis/remoteservice-gateway#setup-instructions\" target=\"_blank\">Remote Service Gateway Setup</a>"}
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
var Module = require("../../../../Modules/Src/Packages/Remote Service Gateway.lspkg/RemoteServiceGatewayCredentials");
Object.setPrototypeOf(script, Module.RemoteServiceGatewayCredentials.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("apiToken", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
