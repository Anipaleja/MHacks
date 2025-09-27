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
// @input SceneObject modelParent
// @input Component.Image img
// @input Component.Text promptDisplay
// @input SceneObject spinner
// @input Asset.Material mat
// @input SceneObject displayPlate
// @input SceneObject colliderObj
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
var Module = require("../../../../Modules/Src/Assets/Scripts/Snap3DInteractable");
Object.setPrototypeOf(script, Module.Snap3DInteractable.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("modelParent", []);
    checkUndefined("img", []);
    checkUndefined("promptDisplay", []);
    checkUndefined("spinner", []);
    checkUndefined("mat", []);
    checkUndefined("displayPlate", []);
    checkUndefined("colliderObj", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
