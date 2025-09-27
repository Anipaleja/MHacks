import { Buffer } from "Scripts/Utils/Buffer";
import { DartBoardController } from "Scripts/DartBoardController";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";

@component
export class DartBehavior extends BaseScriptComponent {
    @input
    audio:AudioComponent

    physicsBody:BodyComponent
    interactable:Interactable

    private t:Transform

    private handInputData = SIK.HandInputData;
    private hand = this.handInputData.getHand('right');

    private isFlying = false
    private startedFlyingAt = -1
    private isHolding = false
    private accumulatedForce:vec3 = vec3.zero()
    private prevHandVelocity:vec3 = vec3.zero()
    private prevPos:vec3 = vec3.zero()

    private rotationBuffer:Buffer = new Buffer(4)
    private positionBuffer:Buffer = new Buffer(4)

    private velocityBuffer:Buffer = new Buffer(4)
    private accBuffer:Buffer = new Buffer(4)

    private OBJECT_MASS = 0.04

    private HAND_ACCELERATION_MULTIPLIER = 0.12
    private HAND_BASE_VELOCITY_MULTIPLIER = 0.3
    private BOARD_OFFSET = 2

    private dartBoardT:Transform

    @input
    public dartboardController:DartBoardController

    private frameNmr = 0

    private objectHit:SceneObject
    private objectHitT:Transform

    /**
     * If the ball falls below this Y position in the scene world,
     * it will be destroyed, simulating hitting "the ground."
     */
    private GROUND_Y_OFFSET = -350

    onAwake() {
        this.audio.playbackMode = Audio.PlaybackMode.LowLatency

        this.physicsBody = this.sceneObject.getComponent("Physics.BodyComponent")
        this.physicsBody.mass = this.OBJECT_MASS
        this.physicsBody.onCollisionEnter.add(this.onCollisionEnter.bind(this))

        this.interactable = this.sceneObject.getComponent(Interactable.getTypeName())
        this.interactable.onTriggerStart(this.onTriggerStart.bind(this))
        this.interactable.onTriggerEnd(this.onTriggerEnd.bind(this))

        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))

        this.t = this.getTransform()
    }

    onTriggerStart (e:InteractorEvent) {
        let inputType = e.interactor.inputType
        this.hand = this.handInputData.getHand(inputType == InteractorInputType.LeftHand ? 'left' : 'right');

        let startPoint = this.hand.indexKnuckle.position.add(this.hand.thumbKnuckle.position).uniformScale(0.5)
        let nudgeLeftDir = this.hand.middleKnuckle.position.sub(this.hand.pinkyKnuckle.position)
        startPoint = startPoint.add(nudgeLeftDir.normalize().uniformScale(5))
        let nudgeUpDir = this.hand.indexKnuckle.position.sub(this.hand.wrist.position)
        startPoint = startPoint.add(nudgeUpDir.normalize().uniformScale(3))

        let endPoint = this.hand.indexTip.position.add(this.hand.thumbTip.position).uniformScale(0.5)
        let direction = startPoint.sub(endPoint)

        this.isHolding = true
        this.prevHandVelocity = vec3.zero()
        this.accumulatedForce = vec3.zero()

        if (global.deviceInfoSystem.isDesktop()) {
            return
        }

        this.t.setWorldPosition(endPoint)
        this.t.setWorldRotation(quat.lookAt(direction, vec3.up()))

    }

    onTriggerEnd () {
        this.physicsBody.intangible = false
        this.physicsBody.dynamic = true

        let baseVelocity = this.getHandVelocity()
        baseVelocity = baseVelocity.uniformScale(this.HAND_BASE_VELOCITY_MULTIPLIER)
        let finalVelocity = baseVelocity.add(this.accumulatedForce)
        this.physicsBody.velocity = finalVelocity

        this.isHolding = false

        this.isFlying = true
        this.startedFlyingAt = getTime()

        this.prevHandVelocity = vec3.zero()
        this.accumulatedForce = vec3.zero()
    }

    onCollisionEnter(e) {

        var collision = e.collision;
        let isDartBoardHit = false

        let closestHit = null;
        let wCamera = WorldCameraFinderProvider.getInstance().getWorldPosition()
        let hitObject:SceneObject = null
    
        e.collision.contacts.forEach(contact => {
            this.objectHit = collision.collider.getSceneObject()
            this.objectHitT = this.objectHit.getTransform()

            if (collision.collider.getSceneObject().name == "DartBoard") {
                isDartBoardHit = true
                this.dartBoardT = this.objectHitT
            }

            if (closestHit == null) { 
                hitObject = collision.collider.getSceneObject()
                closestHit = contact.position 
            }
            else {
                if (contact.position.distance(wCamera) < closestHit.distance(wCamera)) {
                    closestHit = contact.position
                    hitObject = collision.collider.getSceneObject()
                }
            }

            this.isFlying = false
        })

        if (isDartBoardHit) {

            let touchPoint = this.t.getWorldPosition()
            let touchRotation = this.t.getWorldRotation()
            let cScale = this.t.getWorldScale()

            // if the distance between the hit and the position is too high
            // do custom calculation to find the point intersecting the board
            if (this.t.getWorldPosition().distance(this.prevPos) > 1.2) {
                let res = this.getTouchPointPlaneIntersections(touchPoint, touchRotation)
                touchPoint = res[0]
                touchRotation = res[1]
            }

            if (this.isStraightHit(touchRotation)) {
                // Physics off
                this.physicsBody.dynamic = false
                this.physicsBody.velocity = vec3.zero()

                // turn the hit into the position of the tip instead of center
                let childWorldPosition = touchPoint // W_c: child's world position
                let childLocalPosition = new vec3(0,0,-0.66) // L_c: child's local position
                let parentTransform = this.t;   // Reference to the parent transform
                let parentWorldPosition = childWorldPosition.sub(touchRotation.multiplyVec3((childLocalPosition.mult(parentTransform.getWorldScale()))))
                
                this.sceneObject.setParent(this.objectHit)

                this.t.setWorldPosition(parentWorldPosition)
                this.t.setWorldRotation(touchRotation)
                this.t.setWorldScale(cScale)

                this.dartboardController.playDartHitSound()
            }
            else {
                // not a straight hit
                this.dartboardController.playDartBouncedSound()
            }
        }
    }

    isStraightHit (rot:quat) {
        let angle = this.dartBoardT.forward.angleTo(rot.multiplyVec3(vec3.forward())) * (180/Math.PI)
        // ScreenLogger.getInstance().log(":" + (angle).toFixed(1))
        return angle < 66 && angle > 0// check if less than 66 deg
    }

    onUpdate () {
        if (this.isHolding && getDeltaTime() > 0) {
            let handAcceleration = (this.getHandVelocity().sub(this.prevHandVelocity)).uniformScale(1/(Math.max(0.016666, getDeltaTime())));
            this.accumulatedForce = this.accumulatedForce.add(handAcceleration.uniformScale(this.HAND_ACCELERATION_MULTIPLIER));
            
            this.velocityBuffer.add(this.getHandVelocity())
            this.accBuffer.add(this.accumulatedForce)

            this.prevHandVelocity = this.getHandVelocity()
            this.prevPos = this.t.getWorldPosition()
            this.rotationBuffer.add(this.t.getWorldRotation())
            this.positionBuffer.add(this.t.getWorldPosition())    
        }

        if (this.startedFlyingAt > 0 && getTime() - this.startedFlyingAt > 20) {
            this.destroy()
            return
        }

        if (this.t.getWorldPosition().y < this.GROUND_Y_OFFSET) {
            this.destroy()
            return
        }

        this.frameNmr += 1
    }

    getTouchPointPlaneIntersections (curPoint, curRot):[vec3,quat] {
        let positivePoint = null
        let negativeDist = -(this.dartBoardT.getWorldPosition().sub(curPoint).dot(this.dartBoardT.forward))
        let negativePoint = curPoint

        if (negativeDist > 0) {
            return [curPoint, curRot]
        }

        for (var ind = 0; ind < this.positionBuffer.size(); ind++) {
            let pos = this.positionBuffer.getMostRecentFromInd(ind)
            let rot = this.rotationBuffer.getOldestValue()
            let newDist = -(this.dartBoardT.getWorldPosition().sub(pos).dot(this.dartBoardT.forward))

            if (newDist < 0) {
                negativePoint = pos
            }
            else if (newDist < 0.5) {
                return [pos, rot]
            }
            else {
                positivePoint = pos
                curRot = rot
                break;
            }
        }

        if (negativePoint != null && positivePoint != null) {
            let p = this.getPlaneIntersectionsBetweenPoints(negativePoint, positivePoint)
            return [p, curRot]
        }
        else {
            // defaulting
            return [curPoint, curRot]
        }
    }

    // given two points, finds the direction vector and then the point that 
    // intersects the plane
    getPlaneIntersectionsBetweenPoints (pointA, pointB) {
        let dir = pointB.sub(pointA)
        let dotProduct = dir.dot(this.dartBoardT.forward)

        let dist = (this.dartBoardT.getWorldPosition().sub(pointA).dot(this.dartBoardT.forward) + this.BOARD_OFFSET)
        let t = dist / dotProduct
        let intersectionPoint = pointA.add(dir.uniformScale(t))
        return intersectionPoint
    }

    destroy () {
        this.sceneObject.destroy()
    }

    getHandVelocity(): vec3 {
        // If in the Lens Studio Editor, return a fixed simulated velocity
        if (global.deviceInfoSystem.isEditor()) {
            return WorldCameraFinderProvider.getInstance().forward().uniformScale(-1050);
        }
    
        // Retrieve the hand's object-specific velocity data if available
        const objectSpecificData = this.hand.objectTracking3D.objectSpecificData;
        if (objectSpecificData) {
            const handVelocity = objectSpecificData['global'];
    
            // If the magnitude of the velocity is too low,
            // it is likely just jitter so we ignore by returning 0
            if (handVelocity.length < 2) {
                return vec3.zero();
            }
    
            return handVelocity;
        }
    
        // If no tracking data is available, return zero
        return vec3.zero();
    }

}
