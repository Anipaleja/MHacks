import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { Grabbable } from "./Grabbable";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";

@component
export class RacketGrabbable extends BaseScriptComponent {

    private isGrabbed: boolean = false;
    private isHandOverlapping: boolean = false;

    @input
    @hint('This is the material that will provide the mesh outline')
    public targetOutlineMaterial: Material;

    @input
    public meshVisual:RenderMeshVisual;

    @input
    public handColliderName:string = "ColliderTargetProvider"

    private grabbable:Grabbable;

    private t:Transform

    // Reference to SIK (Spectacles Interaction Kit) hand input data.
    private handInputData = SIK.HandInputData;

    // Storing a reference to a specific tracked hand (e.g. 'right' or 'left').
    private hand = this.handInputData.getHand('right');

    private highlightMaterial: Material;

    onAwake() {

        if (!this.grabbable) {
            this.grabbable = this.sceneObject.getComponent(Grabbable.getTypeName());
        }

        if (!this.grabbable) {
            print("This module requires the Grabbable component.");
            return;
        }

        this.highlightMaterial = this.targetOutlineMaterial.clone();

        this.t = this.sceneObject.getTransform();

        this.grabbable.onGrabStartEvent.add((interactor) => {
            this.onGrabBegin(interactor)
        });
        this.grabbable.onGrabEndEvent.add((interactor) => {
            this.onGrabEnd(interactor)
        });

        this.grabbable.onHoverStartEvent.add(() => {
            if (this.isGrabbed) { return; }
            this.addMaterialToRenderMeshArray()
        })

        this.grabbable.onHoverEndEvent.add(() => {
            this.removeMaterialFromRenderMeshArray()
        })

        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
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

    getHandPosition ():vec3 {
        return this.hand.indexKnuckle.position.add(this.hand.thumbKnuckle.position).uniformScale(0.5);
    }

    getHandRotation ():quat {
        let r = this.hand.indexKnuckle.rotation

        // Convert degrees to radians
        var radians = -20 * (Math.PI / 180);
        // Axis to rotate around
        var axis = this.hand.indexKnuckle.forward;
        // Rotation we will apply to the object's current rotation
        var rotationToApply = quat.angleAxis(radians, axis);
                
        // Get the new rotation by rotating the old rotation by rotationToApply
        var newR = rotationToApply.multiply(r);
        
        // Convert degrees to radians
        var radians = 20 * (Math.PI / 180);
        // Axis to rotate around
        var axis = this.hand.indexKnuckle.up;
        // Rotation we will apply to the object's current rotation
        var rotationToApply = quat.angleAxis(radians, axis);
        // Get the new rotation by rotating the old rotation by rotationToApply
        newR = rotationToApply.multiply(r);

        return newR
    }

    private onGrabBegin(interactor:Interactor) {
        this.isGrabbed = true;
        this.t.setWorldPosition(this.getHandPosition());
        this.t.setWorldRotation(this.getHandRotation());
        this.removeMaterialFromRenderMeshArray()
    }
    
    private onGrabEnd(interactor:Interactor) {
        this.isGrabbed = false;
    }

    onUpdate() {
        if (this.isGrabbed) {
            this.t.setWorldPosition(this.getHandPosition());
            this.t.setWorldRotation(this.getHandRotation());
        }
    }

}
