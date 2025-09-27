"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleGeminiLive = void 0;
var __selfType = requireType("./ExampleGeminiLive");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const AudioProcessor_1 = require("../../Helpers/AudioProcessor");
const Gemini_1 = require("../Gemini");
const VideoController_1 = require("../../Helpers/VideoController");
let ExampleGeminiLive = class ExampleGeminiLive extends BaseScriptComponent {
    onAwake() {
        this.websocketRequirementsObj.enabled = true;
        this.createEvent("OnStartEvent").bind(() => {
            this.dynamicAudioOutput.initialize(24000);
            this.microphoneRecorder.setSampleRate(16000);
            this.createGeminiLiveSession();
        });
        // Display internet connection status
        this.textDisplay.text = global.deviceInfoSystem.isInternetAvailable()
            ? "Websocket connected"
            : "No internet";
        global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
            this.textDisplay.text = args.isInternetAvailable
                ? "Reconnected to internete"
                : "No internet";
        });
    }
    createGeminiLiveSession() {
        let GeminiLive = Gemini_1.Gemini.liveConnect();
        GeminiLive.onOpen.add((event) => {
            print("Connection opened");
            let generationConfig = {
                responseModalities: ["AUDIO"],
                temperature: 1,
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: this.voice,
                        },
                    },
                },
            };
            if (!this.haveAudioOutput) {
                generationConfig = {
                    responseModalities: ["TEXT"],
                };
            }
            // Define a tool for changing text color
            const tools = [
                {
                    function_declarations: [
                        {
                            name: "change_text_color",
                            description: "Changes the color of the displayed text",
                            parameters: {
                                type: "object",
                                properties: {
                                    r: {
                                        type: "number",
                                        description: "Value for the red component of the color (0-255)",
                                    },
                                    g: {
                                        type: "number",
                                        description: "Value for the green component of the color (0-255)",
                                    },
                                    b: {
                                        type: "number",
                                        description: "Value for the blue component of the color (0-255)",
                                    },
                                },
                                required: ["r", "g", "b"],
                            },
                        },
                    ],
                },
            ];
            // Send the session setup message
            let modelUri = `models/gemini-2.0-flash-live-preview-04-09`;
            const sessionSetupMessage = {
                setup: {
                    model: modelUri,
                    generation_config: generationConfig,
                    system_instruction: {
                        parts: [
                            {
                                text: this.instructions,
                            },
                        ],
                    },
                    tools: tools,
                    contextWindowCompression: {
                        triggerTokens: 20000,
                        slidingWindow: { targetTokens: 16000 },
                    },
                    output_audio_transcription: {},
                },
            };
            GeminiLive.send(sessionSetupMessage);
        });
        let completedTextDisplay = true;
        GeminiLive.onMessage.add((message) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            print("Received message: " + JSON.stringify(message));
            // Setup complete, begin sending data
            if (message.setupComplete) {
                message = message;
                print("Setup complete");
                // Process microphone input to send to the server
                this.audioProcessor.onAudioChunkReady.add((encodedAudioChunk) => {
                    const message = {
                        realtime_input: {
                            media_chunks: [
                                {
                                    mime_type: "audio/pcm",
                                    data: encodedAudioChunk,
                                },
                            ],
                        },
                    };
                    GeminiLive.send(message);
                });
                // Configure the microphone
                this.microphoneRecorder.onAudioFrame.add((audioFrame) => {
                    this.audioProcessor.processFrame(audioFrame);
                });
                this.microphoneRecorder.startRecording();
                if (this.haveVideoInput) {
                    // Configure the video controller
                    this.videoController.onEncodedFrame.add((encodedFrame) => {
                        //print(encodedFrame)
                        const message = {
                            realtime_input: {
                                media_chunks: [
                                    {
                                        mime_type: "image/jpeg",
                                        data: encodedFrame,
                                    },
                                ],
                            },
                        };
                        GeminiLive.send(message);
                    });
                    this.videoController.startRecording();
                }
            }
            if (message === null || message === void 0 ? void 0 : message.serverContent) {
                message = message;
                // Playback the audio response
                if ((_f = (_e = (_d = (_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.serverContent) === null || _a === void 0 ? void 0 : _a.modelTurn) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.inlineData) === null || _e === void 0 ? void 0 : _e.mimeType) === null || _f === void 0 ? void 0 : _f.startsWith("audio/pcm")) {
                    let b64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                    let audio = Base64.decode(b64Audio);
                    this.dynamicAudioOutput.addAudioFrame(audio);
                }
                // Show output transcription
                else if ((_h = (_g = message === null || message === void 0 ? void 0 : message.serverContent) === null || _g === void 0 ? void 0 : _g.outputTranscription) === null || _h === void 0 ? void 0 : _h.text) {
                    if (completedTextDisplay) {
                        this.textDisplay.text =
                            message.serverContent.outputTranscription.text;
                    }
                    else {
                        this.textDisplay.text +=
                            message.serverContent.outputTranscription.text;
                    }
                    completedTextDisplay = false;
                }
                // Show text response
                else if ((_m = (_l = (_k = (_j = message === null || message === void 0 ? void 0 : message.serverContent) === null || _j === void 0 ? void 0 : _j.modelTurn) === null || _k === void 0 ? void 0 : _k.parts) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.text) {
                    if (completedTextDisplay) {
                        this.textDisplay.text =
                            message.serverContent.modelTurn.parts[0].text;
                    }
                    else {
                        this.textDisplay.text +=
                            message.serverContent.modelTurn.parts[0].text;
                    }
                    completedTextDisplay = false;
                }
                // Determine if the response is complete
                else if ((_o = message === null || message === void 0 ? void 0 : message.serverContent) === null || _o === void 0 ? void 0 : _o.turnComplete) {
                    completedTextDisplay = true;
                }
            }
            if (message.toolCall) {
                message = message;
                print(JSON.stringify(message));
                // Handle tool calls
                message.toolCall.functionCalls.forEach((functionCall) => {
                    if (functionCall.name === "change_text_color") {
                        const args = functionCall.args;
                        this.textDisplay.textFill.color = new vec4(args.r / 255, args.g / 255, args.b / 255, 1);
                        // Send a message back to the server indicating the function call was successful
                        const messageToSend = {
                            tool_response: {
                                function_responses: [
                                    {
                                        name: functionCall.name,
                                        response: { content: "Successfully changed text color" },
                                    },
                                ],
                            },
                        };
                        GeminiLive.send(messageToSend);
                    }
                });
            }
        });
        GeminiLive.onError.add((event) => {
            print("Error: " + event);
        });
        GeminiLive.onClose.add((event) => {
            print("Connection closed: " + event.reason);
        });
    }
    __initialize() {
        super.__initialize();
        this.audioProcessor = new AudioProcessor_1.AudioProcessor();
        this.videoController = new VideoController_1.VideoController();
    }
};
exports.ExampleGeminiLive = ExampleGeminiLive;
exports.ExampleGeminiLive = ExampleGeminiLive = __decorate([
    component
], ExampleGeminiLive);
//# sourceMappingURL=ExampleGeminiLive.js.map