import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class ActivateMicrophoneRecorder extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  private interactable: Interactable;

  onAwake() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    this.interactable.onTriggerStart.add(() => {
      this.microphoneRecorder.recordMicrophoneAudio(true);
    });
    this.interactable.onTriggerEnd.add(() => {
      this.microphoneRecorder.recordMicrophoneAudio(false);
    });
    this.interactable.onTriggerCanceled.add(() => {
      this.microphoneRecorder.recordMicrophoneAudio(false);
    });
  }
}
