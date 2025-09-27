"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleDeepseekCalls = void 0;
var __selfType = requireType("./ExampleDeepseekCalls");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Deepseek_1 = require("../Deepseek");
let ExampleDeepseekCalls = class ExampleDeepseekCalls extends BaseScriptComponent {
    onAwake() {
        if (global.deviceInfoSystem.isEditor()) {
            this.createEvent("TapEvent").bind(() => {
                this.onTap();
            });
        }
        else {
            this.gestureModule
                .getPinchDownEvent(GestureModule.HandType.Right)
                .add(() => {
                this.onTap();
            });
        }
    }
    onTap() {
        if (this.runOnTap) {
            this.doChatCompletions();
        }
    }
    doChatCompletions() {
        this.textDisplay.sceneObject.enabled = true;
        this.textDisplay.text = "Generating...";
        let messageArray = [
            {
                role: "system",
                content: this.systemPrompt,
            },
            {
                role: "user",
                content: this.userPrompt,
            },
        ];
        const deepSeekRequest = {
            model: "DeepSeek-R1",
            messages: messageArray,
            max_tokens: 2048,
            temperature: 0.7,
        };
        Deepseek_1.DeepSeek.chatCompletions(deepSeekRequest)
            .then((response) => {
            var _a, _b, _c, _d;
            let reasoningContent = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.reasoning_content;
            let messageContent = (_d = (_c = response === null || response === void 0 ? void 0 : response.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
            this.textDisplay.text = "Reasoning: " + reasoningContent + "\n\n";
            this.textDisplay.text += "Final answer: " + messageContent;
        })
            .catch((error) => {
            this.textDisplay.text = "Error: " + error;
        });
    }
    __initialize() {
        super.__initialize();
        this.gestureModule = require("LensStudio:GestureModule");
    }
};
exports.ExampleDeepseekCalls = ExampleDeepseekCalls;
exports.ExampleDeepseekCalls = ExampleDeepseekCalls = __decorate([
    component
], ExampleDeepseekCalls);
//# sourceMappingURL=ExampleDeepseekCalls.js.map