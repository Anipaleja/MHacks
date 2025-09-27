"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiAssistant = void 0;
var __selfType = requireType("./GeminiAssistant");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const AudioProcessor_1 = require("Remote Service Gateway.lspkg/Helpers/AudioProcessor");
const Gemini_1 = require("Remote Service Gateway.lspkg/HostedExternal/Gemini");
const VideoController_1 = require("Remote Service Gateway.lspkg/Helpers/VideoController");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
let GeminiAssistant = class GeminiAssistant extends BaseScriptComponent {
    createGeminiLiveSession() {
        this.websocketRequirementsObj.enabled = true;
        this.dynamicAudioOutput.initialize(24000);
        this.microphoneRecorder.setSampleRate(16000);
        // Display internet connection status
        let internetStatus = global.deviceInfoSystem.isInternetAvailable()
            ? "Websocket connected"
            : "No internet";
        this.updateTextEvent.invoke({ text: internetStatus, completed: true });
        global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
            internetStatus = args.isInternetAvailable
                ? "Reconnected to internete"
                : "No internet";
            this.updateTextEvent.invoke({ text: internetStatus, completed: true });
        });
        this.GeminiLive = Gemini_1.Gemini.liveConnect();
        this.GeminiLive.onOpen.add((event) => {
            print("Connection opened");
            this.sessionSetup();
        });
        let completedTextDisplay = true;
        this.GeminiLive.onMessage.add((message) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            print("Received message: " + JSON.stringify(message));
            // Setup complete, begin sending data
            if (message.setupComplete) {
                message = message;
                print("Setup complete");
                this.setupInputs();
            }
            if (message === null || message === void 0 ? void 0 : message.serverContent) {
                message = message;
                // Playback the audio response
                if ((_f = (_e = (_d = (_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.serverContent) === null || _a === void 0 ? void 0 : _a.modelTurn) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.inlineData) === null || _e === void 0 ? void 0 : _e.mimeType) === null || _f === void 0 ? void 0 : _f.startsWith("audio/pcm")) {
                    let b64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                    let audio = Base64.decode(b64Audio);
                    this.dynamicAudioOutput.addAudioFrame(audio);
                }
                if (message.serverContent.interrupted) {
                    this.dynamicAudioOutput.interruptAudioOutput();
                }
                // Show output transcription
                else if ((_h = (_g = message === null || message === void 0 ? void 0 : message.serverContent) === null || _g === void 0 ? void 0 : _g.outputTranscription) === null || _h === void 0 ? void 0 : _h.text) {
                    if (completedTextDisplay) {
                        this.updateTextEvent.invoke({
                            text: (_j = message.serverContent.outputTranscription) === null || _j === void 0 ? void 0 : _j.text,
                            completed: true,
                        });
                    }
                    else {
                        this.updateTextEvent.invoke({
                            text: (_k = message.serverContent.outputTranscription) === null || _k === void 0 ? void 0 : _k.text,
                            completed: false,
                        });
                    }
                    completedTextDisplay = false;
                }
                // Show text response
                else if ((_p = (_o = (_m = (_l = message === null || message === void 0 ? void 0 : message.serverContent) === null || _l === void 0 ? void 0 : _l.modelTurn) === null || _m === void 0 ? void 0 : _m.parts) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.text) {
                    if (completedTextDisplay) {
                        this.updateTextEvent.invoke({
                            text: message.serverContent.modelTurn.parts[0].text,
                            completed: true,
                        });
                    }
                    else {
                        this.updateTextEvent.invoke({
                            text: message.serverContent.modelTurn.parts[0].text,
                            completed: false,
                        });
                    }
                    completedTextDisplay = false;
                }
                // Determine if the response is complete
                else if ((_q = message === null || message === void 0 ? void 0 : message.serverContent) === null || _q === void 0 ? void 0 : _q.turnComplete) {
                    completedTextDisplay = true;
                }
            }
            if (message.toolCall) {
                message = message;
                print(JSON.stringify(message));
                // Handle tool calls
                message.toolCall.functionCalls.forEach((functionCall) => {
                    this.functionCallEvent.invoke({
                        name: functionCall.name,
                        args: functionCall.args,
                    });
                });
            }
        });
        this.GeminiLive.onError.add((event) => {
            print("Error: " + event);
        });
        this.GeminiLive.onClose.add((event) => {
            print("Connection closed: " + event.reason);
        });
    }
    streamData(stream) {
        if (stream) {
            if (this.haveVideoInput) {
                this.videoController.startRecording();
            }
            this.microphoneRecorder.startRecording();
        }
        else {
            if (this.haveVideoInput) {
                this.videoController.stopRecording();
            }
            this.microphoneRecorder.stopRecording();
        }
    }
    setupInputs() {
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
            this.GeminiLive.send(message);
        });
        // Configure the microphone
        this.microphoneRecorder.onAudioFrame.add((audioFrame) => {
            this.audioProcessor.processFrame(audioFrame);
        });
        if (this.haveVideoInput) {
            // Configure the video controller
            this.videoController.onEncodedFrame.add((encodedFrame) => {
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
                this.GeminiLive.send(message);
            });
        }
    }
    sendFunctionCallUpdate(functionName, args) {
        const messageToSend = {
            tool_response: {
                function_responses: [
                    {
                        name: functionName,
                        response: { content: args },
                    },
                ],
            },
        };
        this.GeminiLive.send(messageToSend);
    }
    sessionSetup() {
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
        // Define the Snap3D tool
        const tools = [
            {
                function_declarations: [
                    {
                        name: "Snap3D",
                        description: "Generates a 3D model based on a text prompt",
                        parameters: {
                            type: "object",
                            properties: {
                                prompt: {
                                    type: "string",
                                    description: "The text prompt to generate a 3D model from. Cartoonish styles work best. Use 'full body' when generating characters.",
                                },
                            },
                            required: ["prompt"],
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
        this.GeminiLive.send(sessionSetupMessage);
    }
    interruptAudioOutput() {
        if (this.dynamicAudioOutput && this.haveAudioOutput) {
            this.dynamicAudioOutput.interruptAudioOutput();
        }
        else {
            print("DynamicAudioOutput is not initialized.");
        }
    }
    __initialize() {
        super.__initialize();
        this.audioProcessor = new AudioProcessor_1.AudioProcessor();
        this.videoController = new VideoController_1.VideoController(1500, CompressionQuality.HighQuality, EncodingType.Jpg);
        this.updateTextEvent = new Event_1.default();
        this.functionCallEvent = new Event_1.default();
    }
};
exports.GeminiAssistant = GeminiAssistant;
exports.GeminiAssistant = GeminiAssistant = __decorate([
    component
], GeminiAssistant);
//# sourceMappingURL=GeminiAssistant.js.map