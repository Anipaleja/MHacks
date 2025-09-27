import { HandInteractor } from "SpectaclesInteractionKit.lspkg/Core/HandInteractor/HandInteractor";
import { Interactor, InteractorTriggerType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { MouseInteractor } from "SpectaclesInteractionKit.lspkg/Core/MouseInteractor/MouseInteractor";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { mix } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { lerp } from "SpectaclesInteractionKit.lspkg/Utils/mathUtils";

@component
export class ThrowBehavior extends BaseScriptComponent {

    @input
    objectPrefab:ObjectPrefab;

    //private gestureModule: GestureModule = require('LensStudio:GestureModule');
    
    
    ballStartPoint: vec3;
    latestBall: SceneObject;

    private handInputData = SIK.HandInputData;
    private rightHand = this.handInputData.getHand('right');
    isPinching: boolean;

    @input
    debugText: Text

    @input
    debugBall: SceneObject


    onAwake() {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
        this.rightHand.onPinchDown.add(this.onTriggerDown.bind(this))
        this.rightHand.onPinchUp.add(this.onTriggerUp.bind(this))

        this.createEvent("TapEvent").bind(() => {
            // let body = this.debugBall.getComponent("Physics.BodyComponent")
            // body.addForce(new vec3(0, 1, 0), Physics.ForceMode.Impulse)
            this.onTriggerDown()
            this.onTriggerUp()
        })
    }

    onUpdate() {

        if (this.rightHand.isPinching()) {
            this.latestBall.getTransform().setWorldPosition(this.rightHand.indexTip.position)
        }

        if (!global.deviceInfoSystem.isEditor()) {
            //let xyz = this.getHandVelocity().x.toFixed(1) + " : " + this.getHandVelocity().y.toFixed(1) + " : " + this.getHandVelocity().z.toFixed(1)
            //this.debugText.text = (this.isPinching ? "o" : ".") + " " + this.magnitude(this.getHandVelocity()).toFixed(1)
        }
    }

    onTriggerDown() {
        this.isPinching = true
        print(">>> down")
        this.ballStartPoint = this.rightHand.indexTip.position
        this.latestBall = this.objectPrefab.instantiate(this.sceneObject)
        this.latestBall.getComponent("MeshVisual").mainMaterial = this.latestBall.getComponent("MeshVisual").mainMaterial.clone()
        this.latestBall.getComponent("MeshVisual").mainMaterial.mainPass.mainColor = this.getRandomRainbowColor()
        this.latestBall.getTransform().setWorldPosition(this.ballStartPoint)
        //this.latestBall.getComponent("Physics.BodyComponent").intangible = true
        this.latestBall.getComponent("Physics.BodyComponent").dynamic = false
    }

    onTriggerUp() {
        this.debugText.text = "Force: " + this.magnitude(this.getHandVelocity(1, 0)).toFixed(1)

        print(">>> up")
        this.isPinching = false
        let physicsBody = this.latestBall.getComponent("Physics.BodyComponent")
        let velocity = this.getHandVelocity(0.5, 0.5)

        if (velocity.distance(vec3.zero()) > 5) {
            physicsBody.intangible = false
            physicsBody.dynamic = true
            physicsBody.addForce(this.getBoostedForce(), Physics.ForceMode.Impulse)
        }
        else {
            this.latestBall.destroy()
            this.latestBall = null
        }
    }

    getBoostedVelocity(): vec3 {
        let v = this.getHandVelocity(0.7, 0.3)
        let min = 70
        let max = 150
        let magnitude = this.magnitude(v)
        let r = (magnitude-min)/(max-min)
        let boostAmnt = lerp(10, 150, r)
        return v.uniformScale(boostAmnt)
    }

    getBoostedForce(): vec3 {
        let v = this.getHandVelocity(1, 0)
        return v.uniformScale(0.006)
    }

    getHandVelocity(globalAmount, indexAmount) {
        if (global.deviceInfoSystem.isEditor()) {
            return new vec3(0, 1, -35)
        }

        let objectSpecificData = this.rightHand.objectTracking3D.objectSpecificData
        if (objectSpecificData) {
            let handVelocity = objectSpecificData['global'];
            let fingerVelocity = objectSpecificData['index-3'];
            let averagedVelocity = handVelocity.uniformScale(globalAmount).add(fingerVelocity.uniformScale(indexAmount))

            return averagedVelocity
        }
        else {
            return vec3.zero()
        }
    }

    // Function to generate a random rainbow color using vec4 constructor
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

    expScaleVec3(vector: vec3, exponent: number): vec3 {
        return new vec3(
          Math.sign(vector.x) * Math.pow(Math.abs(vector.x), exponent),
          Math.sign(vector.y) * Math.pow(Math.abs(vector.y), exponent),
          Math.sign(vector.z) * Math.pow(Math.abs(vector.z), exponent)
        );
    }

    magnitude(cVec): number {
        return Math.sqrt(cVec.x * cVec.x + cVec.y * cVec.y + cVec.z * cVec.z);
    }

}
