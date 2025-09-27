/**
 * Acts as a dynamic audio track output for PCM16 input
 */
@component
export class DynamicAudioOutput extends BaseScriptComponent {
  @ui.separator
  @ui.label("This script manages audio output for generative AI models.")
  @ui.separator
  @input
  private audioOutputTrack: AudioTrackAsset;
  private audComponent: AudioComponent;
  private audioOutputProvider: AudioOutputProvider;

  onAwake() {
    this.audioOutputProvider = this.audioOutputTrack
      .control as AudioOutputProvider;
    this.audComponent = this.sceneObject.getComponent("AudioComponent");
  }
  /**
   * Initializes the audio output with the specified sample rate.
   * @param sampleRate - Sample rate for the audio output.
   */
  initialize(sampleRate: number) {
    this.audioOutputProvider.sampleRate = sampleRate;
    this.audComponent.audioTrack = this.audioOutputTrack;
    this.audComponent.play(-1);
  }

  /**
   * Adds an audio frame to the output.
   * @param uint8Array - Audio data in PCM 16-bit format as a Uint8Array.
   */
  addAudioFrame(uint8Array: Uint8Array) {
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

  private convertPCM16ToAudFrameAndShape(uint8Array: Uint8Array): {
    data: Float32Array;
    shape: vec3;
  } {
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
}
