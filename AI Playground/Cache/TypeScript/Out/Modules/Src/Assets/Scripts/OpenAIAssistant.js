"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIAssistant = void 0;
var __selfType = requireType("./OpenAIAssistant");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const AudioProcessor_1 = require("Remote Service Gateway.lspkg/Helpers/AudioProcessor");
const OpenAI_1 = require("Remote Service Gateway.lspkg/HostedExternal/OpenAI");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
let OpenAIAssistant = class OpenAIAssistant extends BaseScriptComponent {
    createOpenAIRealtimeSession() {
        this.websocketRequirementsObj.enabled = true;
        // Display internet connection status
        let internetStatus = global.deviceInfoSystem.isInternetAvailable()
            ? "Websocket connected"
            : "No internet";
        this.updateTextEvent.invoke({ text: internetStatus, completed: true });
        global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
            internetStatus = args.isInternetAvailable
                ? "Reconnected to internet"
                : "No internet";
            this.updateTextEvent.invoke({ text: internetStatus, completed: true });
        });
        this.dynamicAudioOutput.initialize(24000);
        this.microphoneRecorder.setSampleRate(24000);
        this.OAIRealtime = OpenAI_1.OpenAI.createRealtimeSession({
            model: "gpt-4o-mini-realtime-preview",
        });
        this.OAIRealtime.onOpen.add((event) => {
            print("Connection opened");
            this.sessionSetup();
        });
        let completedTextDisplay = true;
        this.OAIRealtime.onMessage.add((message) => {
            // Listen for text responses
            if (message.type === "response.text.delta" ||
                message.type === "response.audio_transcript.delta") {
                if (!completedTextDisplay) {
                    this.updateTextEvent.invoke({
                        text: message.delta,
                        completed: false,
                    });
                }
                else {
                    this.updateTextEvent.invoke({
                        text: message.delta,
                        completed: true,
                    });
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
                    print(`Function args: ${functionCall.arguments}`);
                    let args = JSON.parse(functionCall.arguments);
                    this.functionCallEvent.invoke({
                        name: functionCall.name,
                        args: args,
                        callId: functionCall.call_id, // OpenAI requires a call_id
                    });
                }
            }
            // Listen for user began speaking
            else if (message.type === "input_audio_buffer.speech_started") {
                print("Speech started, interrupting the AI");
                this.dynamicAudioOutput.interruptAudioOutput();
            }
        });
        this.OAIRealtime.onError.add((event) => {
            print("Error: " + event);
        });
        this.OAIRealtime.onClose.add((event) => {
            print("Connection closed: " + event.reason);
            this.updateTextEvent.invoke({
                text: "Websocket closed: " + event.reason,
                completed: true,
            });
        });
    }
    streamData(stream) {
        if (stream) {
            this.microphoneRecorder.startRecording();
        }
        else {
            this.microphoneRecorder.stopRecording();
        }
    }
    interruptAudioOutput() {
        if (this.dynamicAudioOutput && this.haveAudioOutput) {
            this.dynamicAudioOutput.interruptAudioOutput();
        }
        else {
            print("DynamicAudioOutput is not initialized.");
        }
    }
    sessionSetup() {
        let modalitiesArray = ["text"];
        if (this.haveAudioOutput) {
            modalitiesArray.push("audio");
        }
        const tools = [
            {
                type: "function",
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
        ];
        // Set up the session
        let sessionUpdateMsg = {
            type: "session.update",
            session: {
                instructions: this.instructions,
                voice: this.voice,
                modalities: modalitiesArray,
                input_audio_format: "pcm16",
                tools: tools,
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
        this.OAIRealtime.send(sessionUpdateMsg);
        // Process microphone input to send to the server
        this.audioProcessor.onAudioChunkReady.add((encodedAudioChunk) => {
            let audioMsg = {
                type: "input_audio_buffer.append",
                audio: encodedAudioChunk,
            };
            this.OAIRealtime.send(audioMsg);
        });
        // Configure the microphone
        this.microphoneRecorder.onAudioFrame.add((audioFrame) => {
            this.audioProcessor.processFrame(audioFrame);
        });
    }
    sendFunctionCallUpdate(functionName, callId, response) {
        print("Call id = " + callId);
        let messageToSend = {
            type: "conversation.item.create",
            item: {
                type: "function_call_output",
                call_id: callId,
                output: response,
            },
        };
        this.OAIRealtime.send(messageToSend);
    }
    __initialize() {
        super.__initialize();
        this.audioProcessor = new AudioProcessor_1.AudioProcessor();
        this.updateTextEvent = new Event_1.default();
        this.functionCallEvent = new Event_1.default();
    }
};
exports.OpenAIAssistant = OpenAIAssistant;
exports.OpenAIAssistant = OpenAIAssistant = __decorate([
    component
], OpenAIAssistant);
//# sourceMappingURL=OpenAIAssistant.js.map