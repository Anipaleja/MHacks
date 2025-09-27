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
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Submit and Get Status Example"}
// @input string prompt = "A cute dog wearing a hat" {"widget":"text_area"}
// @input bool refineMesh = true
// @input bool useVertexColor
// @ui {"widget":"group_end"}
// @input bool runOnTap
// @input Asset.ObjectPrefab snap3DInteractablePrefab
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
var Module = require("../../../../Modules/Src/Assets/Scripts/Snap3DInteractableFactory");
Object.setPrototypeOf(script, Module.Snap3DInteractableFactory.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("prompt", []);
    checkUndefined("refineMesh", []);
    checkUndefined("useVertexColor", []);
    checkUndefined("runOnTap", []);
    checkUndefined("snap3DInteractablePrefab", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
