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
// @input float anchorDistance = 80
// @ui {"widget":"label", "label":"Anchor Distance (cm)"}
// @input bool autoAnchorOnAwake = true
// @ui {"widget":"label", "label":"Auto Anchor on Awake"}
// @input bool useCurrentPosition
// @ui {"widget":"label", "label":"Use Current Position as Anchor"}
// @input float maxVisibleDistance = 500
// @ui {"widget":"label", "label":"Max Visible Distance (cm)"}
// @input bool enableDistanceFading = true
// @ui {"widget":"label", "label":"Enable Distance Fading"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/WorldAnchor");
Object.setPrototypeOf(script, Module.WorldAnchor.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("anchorDistance", []);
    checkUndefined("autoAnchorOnAwake", []);
    checkUndefined("useCurrentPosition", []);
    checkUndefined("maxVisibleDistance", []);
    checkUndefined("enableDistanceFading", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
