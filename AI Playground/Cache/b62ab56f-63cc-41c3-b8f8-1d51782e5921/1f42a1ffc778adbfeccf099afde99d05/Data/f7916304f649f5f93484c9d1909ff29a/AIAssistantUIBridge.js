"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAssistantUIBridge = void 0;
var __selfType = requireType("./AIAssistantUIBridge");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
var AssistantType;
(function (AssistantType) {
    AssistantType["Gemini"] = "Gemini";
    AssistantType["OpenAI"] = "OpenAI";
})(AssistantType || (AssistantType = {}));
let AIAssistantUIBridge = class AIAssistantUIBridge extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }
    onStart() {
        this.geminiButton.onButtonPinched.add(() => {
            this.assistantType = AssistantType.Gemini;
            this.hintTitle.text = "Gemini Live Example";
            this.startWebsocketAndUI();
        });
        this.openAIButton.onButtonPinched.add(() => {
            this.assistantType = AssistantType.OpenAI;
            this.hintTitle.text = "OpenAI Realtime Example";
            this.startWebsocketAndUI();
        });
    }
    hideButtons() {
        this.geminiButton.enabled = false;
        this.openAIButton.enabled = false;
        LSTween_1.LSTween.scaleToLocal(this.geminiButton.sceneObject.getTransform(), vec3.zero(), 500)
            .easing(Easing_1.default.Quadratic.Out)
            .onComplete(() => {
            this.geminiButton.sceneObject.enabled = false;
        })
            .start();
        LSTween_1.LSTween.scaleToLocal(this.openAIButton.sceneObject.getTransform(), vec3.zero(), 500)
            .easing(Easing_1.default.Quadratic.Out)
            .onComplete(() => {
            this.openAIButton.sceneObject.enabled = false;
        })
            .start();
    }
    startWebsocketAndUI() {
        this.hideButtons();
        this.hintText.text = "Pinch on the orb next to your left hand to activate";
        if (global.deviceInfoSystem.isEditor()) {
            this.hintText.text = "Look down and click on the orb to activate";
        }
        this.sphereController.initializeUI();
        // Set the current assistant based on selection
        this.currentAssistant =
            this.assistantType === AssistantType.Gemini
                ? this.geminiAssistant
                : this.openAIAssistant;
        if (this.assistantType === AssistantType.Gemini) {
            this.geminiAssistant.createGeminiLiveSession();
        }
        else if (this.assistantType === AssistantType.OpenAI) {
            this.openAIAssistant.createOpenAIRealtimeSession();
        }
        // Connect the selected assistant to the UI
        this.connectAssistantEvents();
        // Connect sphere controller activation to the current assistant
        this.sphereController.isActivatedEvent.add((isActivated) => {
            if (this.textIsVisible) {
                LSTween_1.LSTween.textAlphaTo(this.hintTitle, 0, 600).start();
                LSTween_1.LSTween.textAlphaTo(this.hintText, 0, 600).start();
                let bgColor = this.hintTitle.backgroundSettings.fill.color;
                LSTween_1.LSTween.rawTween(600)
                    .onUpdate((tweenData) => {
                    let percent = tweenData.t;
                    bgColor.a = 1 - percent;
                    this.hintTitle.backgroundSettings.fill.color = bgColor;
                })
                    .start();
            }
            this.textIsVisible = false;
            this.currentAssistant.streamData(isActivated);
            if (!isActivated) {
                this.currentAssistant.interruptAudioOutput();
            }
        });
    }
    connectAssistantEvents() {
        // Connect text update events
        this.currentAssistant.updateTextEvent.add((data) => {
            this.sphereController.setText(data);
        });
        // Connect function call events
        this.currentAssistant.functionCallEvent.add((data) => {
            if (data.name === "Snap3D") {
                // Send a response based on which assistant is active
                if (this.assistantType === AssistantType.Gemini) {
                    this.geminiAssistant.sendFunctionCallUpdate(data.name, "Beginning to create 3D object...");
                }
                else {
                    this.openAIAssistant.sendFunctionCallUpdate(data.name, data.callId, // OpenAI requires a call_id
                    "Beginning to create 3D object...");
                }
                // Create the 3D object and handle the response
                this.snap3DInteractableFactory
                    .createInteractable3DObject(data.args.prompt)
                    .then((status) => {
                    if (this.assistantType === AssistantType.Gemini) {
                        this.geminiAssistant.sendFunctionCallUpdate(data.name, status);
                    }
                    else {
                        this.openAIAssistant.sendFunctionCallUpdate(data.name, data.callId, status);
                    }
                })
                    .catch((error) => {
                    if (this.assistantType === AssistantType.Gemini) {
                        this.geminiAssistant.sendFunctionCallUpdate(data.name, error);
                    }
                    else {
                        this.openAIAssistant.sendFunctionCallUpdate(data.name, data.callId, error);
                    }
                });
            }
        });
    }
    __initialize() {
        super.__initialize();
        this.assistantType = AssistantType.Gemini;
        this.textIsVisible = true;
    }
};
exports.AIAssistantUIBridge = AIAssistantUIBridge;
exports.AIAssistantUIBridge = AIAssistantUIBridge = __decorate([
    component
], AIAssistantUIBridge);
//# sourceMappingURL=AIAssistantUIBridge.js.map