"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrophoneRecorder = void 0;
var __selfType = requireType("./MicrophoneRecorder");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Event_1 = require("../Utils/Event");
/**
 * Class for managing microphone input and recording audio frames.
 */
let MicrophoneRecorder = class MicrophoneRecorder extends BaseScriptComponent {
    onAwake() {
        // Require the VoiceML Module in order to get Bystander Rejection
        require("LensStudio:VoiceMLModule");
        this.micAudioProvider = this.micAudioTrack.control;
        this.recordUpdate = this.createEvent("UpdateEvent");
        this.recordUpdate.bind(this.onUpdate.bind(this));
        this.recordUpdate.enabled = false;
    }
    onUpdate() {
        let audioFrame = new Float32Array(this.micAudioProvider.maxFrameSize);
        let audioShape = this.micAudioProvider.getAudioFrame(audioFrame);
        audioFrame = audioFrame.subarray(0, audioShape.x);
        this.onAudioFrame.invoke(audioFrame);
    }
    /**
     * Sets the sample rate for the microphone audio provider.
     * @param sampleRate The sample rate to set.
     */
    setSampleRate(sampleRate) {
        this.micAudioProvider.sampleRate = sampleRate;
    }
    /**
     * Starts recording audio from the microphone.
     */
    startRecording() {
        this.micAudioProvider.start();
        this.recordUpdate.enabled = true;
    }
    /**
     * Stops recording audio from the microphone.
     */
    stopRecording() {
        this.micAudioProvider.stop();
        this.recordUpdate.enabled = false;
    }
    __initialize() {
        super.__initialize();
        this.onAudioFrame = new Event_1.default();
    }
};
exports.MicrophoneRecorder = MicrophoneRecorder;
exports.MicrophoneRecorder = MicrophoneRecorder = __decorate([
    component
], MicrophoneRecorder);
//# sourceMappingURL=MicrophoneRecorder.js.map