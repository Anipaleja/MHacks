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
// @ui {"widget":"label", "label":"Manages the UI and hand intereactions for the AI assistant"}
// @ui {"widget":"separator"}
// @input Asset.Material hoverMat
// @input SceneObject orbInteractableObj
// @input SceneObject orbObject
// @input SceneObject orbVisualParent
// @input SceneObject orbScreenPosition
// @input SceneObject closeObj
// @input SceneObject closeButtonInteractable
// @input Component.Text worldSpaceText
// @input Component.Text screenSpaceText
// @input SceneObject uiParent
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
var Module = require("../../../../Modules/Src/Assets/Scripts/SphereController");
Object.setPrototypeOf(script, Module.SphereController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("hoverMat", []);
    checkUndefined("orbInteractableObj", []);
    checkUndefined("orbObject", []);
    checkUndefined("orbVisualParent", []);
    checkUndefined("orbScreenPosition", []);
    checkUndefined("closeObj", []);
    checkUndefined("closeButtonInteractable", []);
    checkUndefined("worldSpaceText", []);
    checkUndefined("screenSpaceText", []);
    checkUndefined("uiParent", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
