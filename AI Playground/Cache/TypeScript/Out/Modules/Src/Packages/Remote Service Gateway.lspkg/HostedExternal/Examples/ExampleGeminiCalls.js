"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleGeminiCalls = void 0;
var __selfType = requireType("./ExampleGeminiCalls");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Gemini_1 = require("../Gemini");
let ExampleGeminiCalls = class ExampleGeminiCalls extends BaseScriptComponent {
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
        if (this.generateImageOnTap) {
            this.generateImageExample();
        }
        if (this.doTextGenerationOnTap) {
            this.textToTextExample();
        }
        if (this.doFunctionCallingOnTap) {
            this.functionCallingExample();
        }
    }
    textToTextExample() {
        this.textDisplay.sceneObject.enabled = true;
        this.textDisplay.text = "Generating...";
        let request = {
            model: "gemini-2.0-flash",
            type: "generateContent",
            body: {
                contents: [
                    {
                        parts: [
                            {
                                text: this.modelPrompt,
                            },
                        ],
                        role: "model",
                    },
                    {
                        parts: [
                            {
                                text: this.textPrompt,
                            },
                        ],
                        role: "user",
                    },
                ],
            },
        };
        Gemini_1.Gemini.models(request)
            .then((response) => {
            print("Gemini response: " + JSON.stringify(response));
            this.textDisplay.text = response.candidates[0].content.parts[0].text;
        })
            .catch((error) => {
            print("Gemini error: " + error);
            this.textDisplay.text = "Error: " + error;
        });
    }
    generateImageExample() {
        this.imgObject.enabled = true;
        let request = {
            model: "gemini-2.0-flash-preview-image-generation",
            type: "generateContent",
            body: {
                contents: [
                    {
                        parts: [
                            {
                                text: this.imageGenerationPrompt,
                            },
                        ],
                        role: "user",
                    },
                ],
                generationConfig: {
                    responseModalities: ["TEXT", "IMAGE"],
                },
            },
        };
        Gemini_1.Gemini.models(request)
            .then((response) => {
            for (let part of response.candidates[0].content.parts) {
                if (part === null || part === void 0 ? void 0 : part.inlineData) {
                    let b64Data = part.inlineData.data;
                    Base64.decodeTextureAsync(b64Data, (texture) => {
                        let imgComponent = this.imgObject.getComponent("Image");
                        let imageMaterial = imgComponent.mainMaterial.clone();
                        imgComponent.mainMaterial = imageMaterial;
                        imgComponent.mainPass.baseTex = texture;
                    }, () => {
                        print("Failed to decode texture from base64 data.");
                    });
                }
            }
        })
            .catch((error) => {
            print("Error while generating image: " + error);
            this.textDisplay.text = "Error: " + error;
        });
    }
    functionCallingExample() {
        this.textDisplay.sceneObject.enabled = true;
        this.textDisplay.text = "Processing function call...";
        let request = {
            model: "gemini-2.0-flash",
            type: "generateContent",
            body: {
                contents: [
                    {
                        parts: [
                            {
                                text: this.functionCallingPrompt,
                            },
                        ],
                        role: "user",
                    },
                ],
                tools: [
                    {
                        functionDeclarations: [
                            {
                                name: "set_text_color",
                                description: "Set the color of the text display",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        red: {
                                            type: "number",
                                            description: "Red component of the color (0-255)",
                                        },
                                        green: {
                                            type: "number",
                                            description: "Green component of the color (0-255)",
                                        },
                                        blue: {
                                            type: "number",
                                            description: "Blue component of the color (0-255)",
                                        },
                                    },
                                    required: ["red", "green", "blue"],
                                },
                            },
                        ],
                    },
                ],
            },
        };
        Gemini_1.Gemini.models(request)
            .then((response) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            print("Gemini function call response: " + JSON.stringify(response));
            // Check for function calls in the response
            const functionCalls = (_d = (_c = (_b = (_a = response.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.functionCall;
            if (functionCalls && functionCalls.name === "set_text_color") {
                try {
                    const args = functionCalls.args;
                    const r = args.red || 0;
                    const g = args.green || 0;
                    const b = args.blue || 0;
                    // Set the text color
                    this.textDisplay.textFill.color = new vec4(r / 255, g / 255, b / 255, 1);
                    this.textDisplay.text = `Text color set to RGB(${r}, ${g}, ${b})`;
                }
                catch (e) {
                    this.textDisplay.text = "Error parsing function arguments: " + e;
                }
            }
            else {
                // If no function call was made, display the regular text response
                const textResponse = (_h = (_g = (_f = (_e = response.candidates[0]) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.parts) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.text;
                if (textResponse) {
                    this.textDisplay.text = textResponse;
                }
                else {
                    this.textDisplay.text =
                        "No function call or text response received";
                }
            }
        })
            .catch((error) => {
            print("Gemini function call error: " + error);
            this.textDisplay.text = "Error: " + error;
        });
    }
    __initialize() {
        super.__initialize();
        this.gestureModule = require("LensStudio:GestureModule");
    }
};
exports.ExampleGeminiCalls = ExampleGeminiCalls;
exports.ExampleGeminiCalls = ExampleGeminiCalls = __decorate([
    component
], ExampleGeminiCalls);
//# sourceMappingURL=ExampleGeminiCalls.js.map