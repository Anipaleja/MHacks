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
// @ui {"widget":"label", "label":"Connects the AI Assistant to the Sphere Controller UI"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Assistants"}
// @ui {"widget":"label", "label":"Customize the voice and behavior of the assistants on their respective components."}
// @input AssignableType geminiAssistant
// @input AssignableType_1 openAIAssistant
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"UI Elements"}
// @input AssignableType_2 sphereController
// @input AssignableType_3 snap3DInteractableFactory
// @input Component.Text hintTitle
// @input Component.Text hintText
// @input AssignableType_4 geminiButton
// @input AssignableType_5 openAIButton
// @ui {"widget":"group_end"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/AIAssistantUIBridge");
Object.setPrototypeOf(script, Module.AIAssistantUIBridge.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("geminiAssistant", []);
    checkUndefined("openAIAssistant", []);
    checkUndefined("sphereController", []);
    checkUndefined("snap3DInteractableFactory", []);
    checkUndefined("hintTitle", []);
    checkUndefined("hintText", []);
    checkUndefined("geminiButton", []);
    checkUndefined("openAIButton", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
