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
// @input bool anchorOnStart = true
// @ui {"widget":"label", "label":"Anchor on Start"}
// @input float maxVisibleDistance = 500
// @ui {"widget":"label", "label":"Max Visible Distance (cm)"}
// @input float fadeStartDistance = 300
// @ui {"widget":"label", "label":"Fade Start Distance (cm)"}
// @input bool enableDistanceFading = true
// @ui {"widget":"label", "label":"Enable Distance Fading"}
// @input bool showDistanceDebug
// @ui {"widget":"label", "label":"Show Distance Debug"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/PositionAnchor");
Object.setPrototypeOf(script, Module.PositionAnchor.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("anchorOnStart", []);
    checkUndefined("maxVisibleDistance", []);
    checkUndefined("fadeStartDistance", []);
    checkUndefined("enableDistanceFading", []);
    checkUndefined("showDistanceDebug", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
