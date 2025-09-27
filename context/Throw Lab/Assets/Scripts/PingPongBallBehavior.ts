import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { Buffer } from "Scripts/Utils/Buffer";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { TennisBallBehavior } from "./TennisBallBehavior";

@component
export class PingPongBallBehavior extends TennisBallBehavior {

    protected OBJECT_MASS = 0.020
    protected HAND_ACCELERATION_MULTIPLIER = 0.08
    protected HAND_BASE_VELOCITY_MULTIPLIER = 0.6

    onAwake() {
        this.audio.playbackMode = Audio.PlaybackMode.LowLatency

        this.sceneObject.getComponent("MeshVisual").mainMaterial = this.sceneObject.getComponent("MeshVisual").mainMaterial.clone()
        this.sceneObject.getComponent("MeshVisual").mainMaterial.mainPass.mainColor = this.getRandomRainbowColor()

        this.physicsBody = this.sceneObject.getComponent("Physics.BodyComponent")
        this.physicsBody.mass = this.OBJECT_MASS
        this.physicsBody.onCollisionEnter.add(this.onCollisionEnter.bind(this))

        this.interactable = this.sceneObject.getComponent(Interactable.getTypeName())
        this.interactable.onTriggerStart(this.onTriggerStart.bind(this))
        this.interactable.onTriggerEnd(this.onTriggerEnd.bind(this))

        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))

        this.t = this.getTransform()
    }

    getRandomRainbowColor(): vec4 {
        // Define rainbow colors as vec4 (RGBA, with alpha = 1.0 for full opacity)
        const rainbowColors = [
            new vec4(148 / 255, 0 / 255, 211 / 255, 1.0), // Violet
            new vec4(75 / 255, 0 / 255, 130 / 255, 1.0),  // Indigo
            new vec4(0 / 255, 191 / 255, 255 / 255, 1.0),   // Blue
            new vec4(0 / 255, 255 / 255, 0 / 255, 1.0),   // Green
            new vec4(255 / 255, 255 / 255, 0 / 255, 1.0), // Yellow
            new vec4(255 / 255, 127 / 255, 0 / 255, 1.0), // Orange
            new vec4(255 / 255, 0 / 255, 0 / 255, 1.0)    // Red
        ];

        // Select a random index from the rainbow colors array
        const randomIndex = Math.floor(Math.random() * rainbowColors.length);

        // Return the selected random color
        return rainbowColors[randomIndex];
    }

}
