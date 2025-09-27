"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicAudioOutput = void 0;
var __selfType = requireType("./DynamicAudioOutput");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Acts as a dynamic audio track output for PCM16 input
 */
let DynamicAudioOutput = class DynamicAudioOutput extends BaseScriptComponent {
    onAwake() {
        this.audioOutputProvider = this.audioOutputTrack
            .control;
        this.audComponent = this.sceneObject.getComponent("AudioComponent");
    }
    /**
     * Initializes the audio output with the specified sample rate.
     * @param sampleRate - Sample rate for the audio output.
     */
    initialize(sampleRate) {
        this.audioOutputProvider.sampleRate = sampleRate;
        this.audComponent.audioTrack = this.audioOutputTrack;
        this.audComponent.play(-1);
    }
    /**
     * Adds an audio frame to the output.
     * @param uint8Array - Audio data in PCM 16-bit format as a Uint8Array.
     */
    addAudioFrame(uint8Array) {
        if (!this.audComponent.isPlaying()) {
            this.audComponent.play(-1);
        }
        let { data, shape } = this.convertPCM16ToAudFrameAndShape(uint8Array);
        this.audioOutputProvider.enqueueAudioFrame(data, shape);
    }
    /**
     * Stops the audio output if it is currently playing.
     */
    interruptAudioOutput() {
        if (this.audComponent.isPlaying()) {
            this.audComponent.stop(false);
        }
    }
    convertPCM16ToAudFrameAndShape(uint8Array) {
        // Ensure we process only complete samples (2 bytes each)
        const safeLength = uint8Array.length - (uint8Array.length % 2);
        let bufferSize = safeLength / 2;
        let data = new Float32Array(bufferSize);
        for (let i = 0, j = 0; i < safeLength; i += 2, j++) {
            const sample = ((uint8Array[i] | (uint8Array[i + 1] << 8)) << 16) >> 16;
            data[j] = sample / 32768.0;
        }
        let shape = new vec3(bufferSize, 1, 1);
        return { data: data, shape: shape };
    }
};
exports.DynamicAudioOutput = DynamicAudioOutput;
exports.DynamicAudioOutput = DynamicAudioOutput = __decorate([
    component
], DynamicAudioOutput);
//# sourceMappingURL=DynamicAudioOutput.js.map