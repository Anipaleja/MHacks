"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleOAICalls = void 0;
var __selfType = requireType("./ExampleOAICalls");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const OpenAI_1 = require("../OpenAI");
let ExampleOAICalls = class ExampleOAICalls extends BaseScriptComponent {
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
        if (this.generateVoiceOnTap) {
            this.doSpeechGeneration();
        }
        if (this.generateImageOnTap) {
            this.doImageGeneration();
        }
        if (this.doChatCompletionsOnTap) {
            this.doChatCompletions();
        }
        if (this.doFunctionCallingOnTap) {
            this.doFunctionCalling();
        }
    }
    doChatCompletions() {
        this.textDisplay.sceneObject.enabled = true;
        this.textDisplay.text = "Generating...";
        OpenAI_1.OpenAI.chatCompletions({
            model: "gpt-4.1-nano",
            messages: [
                {
                    role: "system",
                    content: this.systemPrompt,
                },
                {
                    role: "user",
                    content: this.userPrompt,
                },
            ],
            temperature: 0.7,
        })
            .then((response) => {
            this.textDisplay.text = response.choices[0].message.content;
        })
            .catch((error) => {
            this.textDisplay.text = "Error: " + error;
        });
    }
    doImageGeneration() {
        this.imgObject.enabled = true;
        OpenAI_1.OpenAI.imagesGenerate({
            model: "dall-e-2",
            prompt: this.imageGenerationPrompt,
            n: 1,
            size: "512x512",
        })
            .then((response) => {
            print("Image Generated");
            response.data.forEach((datum) => {
                let url = datum.url;
                let b64 = datum.b64_json;
                if (url) {
                    print("Texture loaded as image URL");
                    let rsm = require("LensStudio:RemoteServiceModule");
                    let resource = rsm.makeResourceFromUrl(url);
                    this.rmm.loadResourceAsImageTexture(resource, (texture) => {
                        let imgComponent = this.imgObject.getComponent("Image");
                        let imageMaterial = imgComponent.mainMaterial.clone();
                        imgComponent.mainMaterial = imageMaterial;
                        imgComponent.mainPass.baseTex = texture;
                    }, () => {
                        print("Failure to download texture from URL");
                    });
                }
                else if (b64) {
                    print("Decoding texture from base64");
                    Base64.decodeTextureAsync(b64, (texture) => {
                        let imgComponent = this.imgObject.getComponent("Image");
                        imgComponent.mainPass.baseTex = texture;
                    }, () => {
                        print("Failure to download texture from base64");
                    });
                }
            });
        })
            .catch((error) => {
            print("Error: " + error);
            this.textDisplay.text = "Error: " + error;
        });
    }
    doSpeechGeneration() {
        OpenAI_1.OpenAI.speech({
            model: "gpt-4o-mini-tts",
            input: this.voiceGenerationPrompt,
            voice: "coral",
            instructions: this.voiceGenerationInstructions,
        })
            .then((response) => {
            print("Got speech response");
            let aud = this.sceneObject.createComponent("AudioComponent");
            aud.audioTrack = response;
            aud.play(1);
        })
            .catch((error) => {
            print("Error: " + error);
            this.textDisplay.text = "Error: " + error;
        });
    }
    doFunctionCalling() {
        this.textDisplay.sceneObject.enabled = true;
        this.textDisplay.text = "Processing function call...";
        // Define available functions
        const tools = [
            {
                type: "function",
                function: {
                    name: "set-text-color",
                    description: "Set the color of the text display",
                    parameters: {
                        type: "object",
                        properties: {
                            r: {
                                type: "number",
                                description: "Red component of the color (0-255)",
                            },
                            g: {
                                type: "number",
                                description: "Green component of the color (0-255)",
                            },
                            b: {
                                type: "number",
                                description: "Blue component of the color (0-255)",
                            },
                        },
                        required: ["r", "g", "b"],
                    },
                },
            },
        ];
        OpenAI_1.OpenAI.chatCompletions({
            model: "gpt-4.1-nano",
            messages: [
                {
                    role: "user",
                    content: this.functionCallingPrompt,
                },
            ],
            tools: tools,
            tool_choice: "auto",
            temperature: 0.7,
        })
            .then((response) => {
            const message = response.choices[0].message;
            if (message.tool_calls && message.tool_calls.length > 0) {
                const toolCall = message.tool_calls[0];
                if (toolCall.function.name === "set-text-color") {
                    let args = JSON.parse(toolCall.function.arguments);
                    this.textDisplay.textFill.color = new vec4(args.r / 255, args.g / 255, args.b / 255, 1);
                    this.textDisplay.text = `Text color set to RGB(${args.r}, ${args.g}, ${args.b})`;
                }
            }
        })
            .catch((error) => {
            this.textDisplay.text = "Error: " + error;
        });
    }
    __initialize() {
        super.__initialize();
        this.rmm = require("LensStudio:RemoteMediaModule");
        this.gestureModule = require("LensStudio:GestureModule");
    }
};
exports.ExampleOAICalls = ExampleOAICalls;
exports.ExampleOAICalls = ExampleOAICalls = __decorate([
    component
], ExampleOAICalls);
//# sourceMappingURL=ExampleOAICalls.js.map