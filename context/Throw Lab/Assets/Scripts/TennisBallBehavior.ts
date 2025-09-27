import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { Buffer } from "Scripts/Utils/Buffer";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { Interactor, InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { Grabbable } from "./Grabbable";
import { ScreenLogger } from "./Utils/ScreenLogger";

/**
 * @component
 * @class TennisBallBehavior
 *
 * This component controls the behavior of a "tennis ball" object in an interactive
 * AR scene. It uses physics and interaction handlers to simulate picking up the ball,
 * accumulating velocity/force based on hand gestures, and then launching the ball
 * into the scene. It also plays a sound effect upon collisions and removes the
 * object if it falls below a certain Y-threshold (representing "ground").
 */
@component
export class TennisBallBehavior extends BaseScriptComponent {
    /**
     * @input
     * Audio component used to play sound effects upon certain collisions.
     */
    @input
    audio: AudioComponent

    @input
    @hint('This is the material that will provide the mesh outline')
    public targetOutlineMaterial: Material;

    @input
    @allowUndefined
    public meshVisual:RenderMeshVisual;

    /**
     * Reference to the physics body component of the tennis ball.
     * Used to apply mass, handle collisions, and manipulate velocity.
     */
    physicsBody: BodyComponent

    /**
     * Reference to the Interactable component, which allows this object
     * to be "grabbed" or interacted with by the user's hand or controller.
     */
    interactable: Interactable

    /**
     * Cached reference to the object's Transform component.
     * Used frequently for position and rotation updates.
     */
    protected t: Transform

    // Reference to SIK (Spectacles Interaction Kit) hand input data.
    private handInputData = SIK.HandInputData;

    // Storing a reference to a specific tracked hand (e.g. 'right' or 'left').
    private hand = this.handInputData.getHand('right');

    // Indicates if the ball is currently being held by the user.
    private isHolding = false

    // Accumulated force applied to the ball while holding, calculated from hand acceleration.
    private accumulatedForce: vec3 = vec3.zero()

    // Stores the previous frame's hand velocity to calculate acceleration.
    private prevHandVelocity: vec3 = vec3.zero()

    /**
     * The physical mass of the tennis ball in scene units.
     */
    protected OBJECT_MASS = 0.056

    /**
     * Scales hand acceleration when applying force to the ball.
     */
    protected HAND_ACCELERATION_MULTIPLIER = 0.08

    /**
     * Scales the base velocity applied from the hand's movement when releasing the ball.
     */
    protected HAND_BASE_VELOCITY_MULTIPLIER = 0.6

    /**
     * If the ball falls below this Y position in the scene world,
     * it will be destroyed, simulating hitting "the ground."
     */
    private GROUND_Y_OFFSET = -350

    private grabbable:Grabbable;
    
    private isGrabbed: boolean = false;
    private isHandOverlapping: boolean = false;

    private highlightMaterial: Material;
    
    initialHandPos: vec3;
    initialTPos: vec3;
    initialHandRot: quat;
    initialTRot: quat;

    /**
     * Called once when the component is initialized.
     * Sets up physics, audio, and interaction events.
     */
    onAwake() {

        if (!this.grabbable) {
            this.grabbable = this.sceneObject.getComponent(Grabbable.getTypeName());
        }

        if (!this.grabbable) {
            print("This module requires the Grabbable component.");
            return;
        }

        // Set audio playback mode for minimal latency on collision sound.
        this.audio.playbackMode = Audio.PlaybackMode.LowLatency

        // Configure physics body parameters.
        this.physicsBody = this.sceneObject.getComponent("Physics.BodyComponent")
        this.physicsBody.mass = this.OBJECT_MASS
        this.physicsBody.onCollisionEnter.add(this.onCollisionEnter.bind(this))

        this.highlightMaterial = this.targetOutlineMaterial.clone();

        // Configure interactable event handlers for picking up and releasing the ball.
        // this.interactable = this.sceneObject.getComponent(Interactable.getTypeName())
        // this.interactable.onTriggerStart(this.onTriggerStart.bind(this))
        // this.interactable.onTriggerEnd(this.onTriggerEnd.bind(this))
        
        this.grabbable.onHoverStartEvent.add(() => {
            this.addMaterialToRenderMeshArray();
        }); 
        this.grabbable.onHoverEndEvent.add(() => {
            this.removeMaterialFromRenderMeshArray();
        });

        this.grabbable.onGrabStartEvent.add(this.onTriggerStart.bind(this)); 
        this.grabbable.onGrabEndEvent.add(this.onTriggerEnd.bind(this));

        // Register an update event callback to handle per-frame logic.
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))

        // Cache a reference to the object's transform for efficient position/rotation updates.
        this.t = this.getTransform()
    }

    /**
     * Called when the ball collides with another object.
     * Plays a sound if it collides with a non-ball object with sufficient force.
     *
     * @param e Collision event containing collision details.
     */
    onCollisionEnter(e) {
        let collision = e.collision;
        let shouldPlayAudio = false

        // Used to determine the closest collision contact point to the world camera.
        let closestHit = null;
        let wCamera = WorldCameraFinderProvider.getInstance().getWorldPosition()
        let hitObject: SceneObject = null
    
        e.collision.contacts.forEach(contact => {
            // Update closest collision point for reference if none is set,
            // or if this contact is closer to the camera.
            if (closestHit == null) { 
                hitObject = collision.collider.getSceneObject()
                closestHit = contact.position 
            } else {
                if (contact.position.distance(wCamera) < closestHit.distance(wCamera)) {
                    closestHit = contact.position
                    hitObject = collision.collider.getSceneObject()
                }
            }

            // If we hit something that isn't another ball and the collision impulse is big enough,
            // we play a sound.
            if (collision.collider.getSceneObject().name.indexOf("Ball") < 0 && contact.impulse > 0.1) {
                shouldPlayAudio = true
            }
        })

        if (shouldPlayAudio) {
            this.audio.play(1)
        }
    }

    /**
     * Called when the user starts interacting with (grabbing) the ball.
     *
     * @param e Interactor event containing info about which hand started the interaction.
     */
    onTriggerStart(interactor:Interactor) {
        // Determine which hand we are using based on the input type.
        this.hand = this.handInputData.getHand(interactor.inputType == InteractorInputType.LeftHand ? 'left' : 'right');

        this.initialHandPos = this.hand.indexKnuckle.position;
        this.initialTPos = this.t.getWorldPosition();
        this.initialHandRot = this.hand.indexKnuckle.rotation;
        this.initialTRot = this.t.getWorldRotation();

        // Calculate a "start point" in front of the hand where the ball should appear when grabbed.
        let startPoint = this.hand.indexKnuckle.position.add(this.hand.thumbKnuckle.position).uniformScale(0.5)
        let nudgeLeftDir = this.hand.middleKnuckle.position.sub(this.hand.pinkyKnuckle.position)
        startPoint = startPoint.add(nudgeLeftDir.normalize().uniformScale(5))
        let nudgeUpDir = this.hand.indexKnuckle.position.sub(this.hand.wrist.position)
        startPoint = startPoint.add(nudgeUpDir.normalize().uniformScale(3))

        // Calculate the "end point" and direction for orienting the ball in the hand.
        let endPoint = this.hand.indexTip.position.add(this.hand.thumbTip.position).uniformScale(0.5)
        let direction = endPoint.sub(startPoint)

        // Move the ball to the end point and orient it.
        this.t.setWorldPosition(endPoint)
        this.t.setWorldRotation(quat.lookAt(direction, vec3.up()))

        // Reset velocities and force accumulation since we just picked up the ball.
        this.prevHandVelocity = vec3.zero()
        this.accumulatedForce = vec3.zero()
        this.isHolding = true
    }

    /**
     * Called when the user releases the ball.
     * The ball becomes dynamic and is launched with the accumulated force and base velocity.
     */
    onTriggerEnd() {
        // Once released, the ball should be affected by physics again.
        this.physicsBody.intangible = false
        this.physicsBody.dynamic = true

        // Calculate the velocity to apply to the ball from the hand movement.
        let baseVelocity = this.getHandVelocity()
        baseVelocity = baseVelocity.uniformScale(this.HAND_BASE_VELOCITY_MULTIPLIER)
        
        // Final velocity = base velocity + any accumulated force from acceleration.
        this.physicsBody.velocity = baseVelocity.add(this.accumulatedForce)

        this.isHolding = false

        // Reset force and velocity trackers.
        this.prevHandVelocity = vec3.zero()
        this.accumulatedForce = vec3.zero()
    }

    addMaterialToRenderMeshArray() {
        const matCount = this.meshVisual.getMaterialsCount();

        let addMaterial = true;
        for (let k = 0; k < matCount; k++) {
            const material = this.meshVisual.getMaterial(k);
            if (material.isSame(this.highlightMaterial)) {
                addMaterial = false;
                break;
            }
        }

        if (addMaterial) {
            const materials = this.meshVisual.materials;
            materials.unshift(this.highlightMaterial);
            this.meshVisual.materials = materials;
        }
    }

    removeMaterialFromRenderMeshArray() {
        const materials = [];

        const matCount = this.meshVisual.getMaterialsCount();

        for (let k = 0; k < matCount; k++) {
            const material = this.meshVisual.getMaterial(k);

            if (material.isSame(this.highlightMaterial)) {
                continue;
            }

            materials.push(material);
        }

        this.meshVisual.clearMaterials();

        for (let k = 0; k < materials.length; k++) {
            this.meshVisual.addMaterial(materials[k]);
        }
    }

    getDeltaHandPos () {
        return this.hand.indexKnuckle.position.sub(this.initialHandPos);
    }

    getDeltaHandRot () {
        return this.hand.indexKnuckle.rotation.multiply(this.initialHandRot.invert());
    }

    /**
     * Called every frame. Updates the ball's physics state and checks if it should be destroyed.
     * When holding, accumulates force from hand acceleration. Also handles rotation buffering.
     */
    onUpdate() {

        // If the ball is being held, update its position and rotation based on hand movement
        if (this.isHolding) {
            let nPos = this.initialTPos.add(this.getDeltaHandPos())
            this.t.setWorldPosition(nPos);
            let nRot = this.getDeltaHandRot().multiply(this.initialTRot)
            this.t.setWorldRotation(nRot);
        }

        let handVelocity = this.getHandVelocity()

        // If the ball is currently held, accumulate force based on changes in hand velocity (acceleration).
        if (this.isHolding && getDeltaTime() > 0) {
            let handAcceleration = (handVelocity.sub(this.prevHandVelocity)).uniformScale(1/(Math.max(0.016666, getDeltaTime())));
            this.accumulatedForce = this.accumulatedForce.add(handAcceleration.uniformScale(this.HAND_ACCELERATION_MULTIPLIER));        
            this.prevHandVelocity = handVelocity;
        }

        // If the ball falls below a certain height, destroy it (simulate hitting the ground).
        if (this.t.getWorldPosition().y < this.GROUND_Y_OFFSET) {
            this.destroy()
        }
    }

    /**
     * Destroys the scene object and removes it from the world.
     * Typically called when the ball is considered "lost" below ground level.
     */
    destroy() {
        this.sceneObject.destroy()
    }

    /**
     * Retrieves the current hand velocity vector used for computing ball's launch velocity and acceleration.
     *
     * @returns Current velocity of the user's hand as a vec3.
     */
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