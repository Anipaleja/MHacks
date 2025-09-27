import { InteractionManager } from "SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager";
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { Interactor } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class Grabbable extends BaseScriptComponent {

    private isGrabbed: boolean = false;
    private isHandOverlapping: boolean = false;

    @input
    @allowUndefined
    public collider: ColliderComponent;

    @input
    public handColliderName:string = "ColliderTargetProvider"

    private gestureModule: GestureModule = require('LensStudio:GestureModule');

    public onGrabStartEvent:Event<Interactor> = new Event<Interactor>();
    public onGrabEndEvent:Event<Interactor> = new Event<Interactor>();

    public onHoverStartEvent:Event = new Event();
    public onHoverEndEvent:Event = new Event();

    onGrabBeginEvent: any;

    onAwake() {

        if (!this.collider) {
            this.collider = this.sceneObject.getComponent("ColliderComponent");
        }

        if (!this.collider) {
            print("Grabbable component requires a collider component.");
            return;
        }

        this.collider.overlapFilter.includeIntangible = true;
        this.collider.onOverlapEnter.add(this.onOverlapEnter.bind(this));
        this.collider.onOverlapExit.add(this.onOverlapExit.bind(this));

        this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Right)
            .add((GrabBeginArgs) => this.onGrabBegin(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.RightHand)[0]));

        this.gestureModule.getGrabEndEvent(GestureModule.HandType.Right)
            .add((GrabEndArgs) => this.onGrabEnd(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.RightHand)[0]));

        this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Left)
            .add((GrabBeginArgs) => this.onGrabBegin(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.LeftHand)[0]));

        this.gestureModule.getGrabEndEvent(GestureModule.HandType.Left)
            .add((GrabEndArgs) => this.onGrabEnd(InteractionManager.getInstance().getInteractorsByType(InteractorInputType.LeftHand)[0]));

    }

    onOverlapEnter (e:OverlapEnterEventArgs) {
        if (e.overlap.collider.getSceneObject().name == this.handColliderName) {
            if (!this.isHandOverlapping) { this.onHoverStartEvent.invoke() }
            this.isHandOverlapping = true;
        }
    }

    onOverlapExit (e:OverlapExitEventArgs) {
        if (e.overlap.collider.getSceneObject().name == this.handColliderName) {
            if (this.isHandOverlapping) { this.onHoverEndEvent.invoke() }
            this.isHandOverlapping = false;
        }
    }

    private onGrabBegin(interactor:Interactor) {
        if (this.isHandOverlapping) {
            this.isGrabbed = true;
            this.onGrabStartEvent.invoke(interactor);
        }
    }

    private onGrabEnd (interactor:Interactor) {
        if (this.isGrabbed) {
            this.onGrabEndEvent.invoke(interactor);
        }
        this.isGrabbed = false;
    }

}