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
// @ui {"widget":"label", "label":"Example of using generative image APIs"}
// @input string modelProvider = "OpenAI" {"widget":"combobox", "values":[{"label":"OpenAI", "value":"OpenAI"}, {"label":"Gemini", "value":"Gemini"}]}
// @ui {"widget":"separator"}
// @input Component.Image image
// @input Component.Text textDisplay
// @input AssignableType asrQueryController
// @input SceneObject spinner
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
var Module = require("../../../../Modules/Src/Assets/Scripts/InteractableImageGenerator");
Object.setPrototypeOf(script, Module.InteractableImageGenerator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("modelProvider", []);
    checkUndefined("image", []);
    checkUndefined("textDisplay", []);
    checkUndefined("asrQueryController", []);
    checkUndefined("spinner", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
