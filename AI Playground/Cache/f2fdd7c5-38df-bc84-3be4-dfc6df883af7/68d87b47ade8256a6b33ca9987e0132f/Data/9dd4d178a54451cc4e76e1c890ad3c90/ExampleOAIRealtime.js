"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleOAIRealtime = void 0;
var __selfType = requireType("./ExampleOAIRealtime");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const AudioProcessor_1 = require("../../Helpers/AudioProcessor");
const OpenAI_1 = require("../OpenAI");
let ExampleOAIRealtime = class ExampleOAIRealtime extends BaseScriptComponent {
    onAwake() {
        this.websocketRequirementsObj.enabled = true;
        this.createEvent("OnStartEvent").bind(() => {
            this.dynamicAudioOutput.initialize(24000);
            this.connectToWebsocket();
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
    connectToWebsocket() {
        let OAIRealtime = OpenAI_1.OpenAI.createRealtimeSession({
            model: "gpt-4o-mini-realtime-preview",
        });
        OAIRealtime.onOpen.add((event) => {
            print("Connection opened");
            let modalitiesArray = ["text"];
            if (this.audioOutput) {
                modalitiesArray.push("audio");
            }
            const setTextColor = {
                type: "function",
                name: "set-text-color",
                description: "Use this function to set the text color of the text display",
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
            };
            // Set up the session
            let sessionUpdateMsg = {
                type: "session.update",
                session: {
                    instructions: this.instructions,
                    voice: this.voice,
                    modalities: modalitiesArray,
                    input_audio_format: "pcm16",
                    tools: [setTextColor],
                    output_audio_format: "pcm16",
                    turn_detection: {
                        type: "server_vad",
                        threshold: 0.5,
                        prefix_padding_ms: 300,
                        silence_duration_ms: 500,
                        create_response: true,
                    },
                },
            };
            OAIRealtime.send(sessionUpdateMsg);
            // Process microphone input to send to the server
            this.audioProcessor.onAudioChunkReady.add((encodedAudioChunk) => {
                let audioMsg = {
                    type: "input_audio_buffer.append",
                    audio: encodedAudioChunk,
                };
                OAIRealtime.send(audioMsg);
            });
            // Configure the microphone
            this.microphoneRecorder.setSampleRate(24000);
            this.microphoneRecorder.onAudioFrame.add((audioFrame) => {
                this.audioProcessor.processFrame(audioFrame);
            });
            this.microphoneRecorder.startRecording();
        });
        let completedTextDisplay = true;
        OAIRealtime.onMessage.add((message) => {
            // Listen for text responses
            if (message.type === "response.text.delta" ||
                message.type === "response.audio_transcript.delta") {
                if (!completedTextDisplay) {
                    this.textDisplay.text += message.delta;
                }
                else {
                    this.textDisplay.text = message.delta;
                }
                completedTextDisplay = false;
            }
            else if (message.type === "response.done") {
                completedTextDisplay = true;
            }
            // Set up Audio Playback
            else if (message.type === "response.audio.delta") {
                let delta = Base64.decode(message.delta);
                this.dynamicAudioOutput.addAudioFrame(delta);
            }
            // Listen for function calls
            else if (message.type === "response.output_item.done") {
                if (message.item && message.item.type === "function_call") {
                    const functionCall = message.item;
                    print(`Function called: ${functionCall.name}`);
                    print(`Function args : ${functionCall.arguments}`);
                    print("call_id: " + functionCall.call_id);
                    let args = JSON.parse(functionCall.arguments);
                    this.textDisplay.textFill.color = new vec4(args.r / 255, args.g / 255, args.b / 255, 1);
                    // Send a message back to the server indicating the function call was successful
                    let messageToSend = {
                        type: "conversation.item.create",
                        item: {
                            type: "function_call_output",
                            call_id: functionCall.call_id,
                            output: "You have successfully called the function to set the text color.",
                        },
                    };
                    OAIRealtime.send(messageToSend);
                }
            }
        });
        OAIRealtime.onError.add((event) => {
            print("Websocket error: " + event);
        });
        OAIRealtime.onClose.add((event) => {
            this.textDisplay.text = "Websocket closed: " + event.reason;
            print("Websocket closed: " + event.reason);
        });
    }
    __initialize() {
        super.__initialize();
        this.audioProcessor = new AudioProcessor_1.AudioProcessor();
    }
};
exports.ExampleOAIRealtime = ExampleOAIRealtime;
exports.ExampleOAIRealtime = ExampleOAIRealtime = __decorate([
    component
], ExampleOAIRealtime);
//# sourceMappingURL=ExampleOAIRealtime.js.map