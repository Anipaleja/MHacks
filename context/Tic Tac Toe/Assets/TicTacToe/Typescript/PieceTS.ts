import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"
import {ControllerTS} from "./ControllerTS"
 
@component
export class Piece extends BaseScriptComponent {

    @input()
    showLogs: boolean

    @input()
    controller: ControllerTS

    @input()
    manipulatable: InteractableManipulation

    sceneObj: SceneObject
    syncEntity: SyncEntity
    isTurnFinished: boolean = false

    finishTurn() {
        if (!this.isTurnFinished) {
            // Piece was moved, tell controller that my turn is complete   
            this.controller.finishTurn();
            this.isTurnFinished = true;
            if (this.showLogs) {
                print(this.sceneObj.name + " moved, turn finished");
            }
        }  
    }

    onReady() {
        if (this.showLogs) {
            print("Sync entity is ready");    
        }   
        
        if (this.syncEntity.networkRoot.locallyCreated) {
            // Piece belongs to me, I can move it
            this.manipulatable.setCanTranslate(true)
            this.manipulatable.onManipulationEnd.add(() => this.finishTurn())
        } else {
            // Piece belongs to other player, I can't move it
            this.manipulatable.setCanTranslate(false)
        }
    }

    onAwake() {
        // Check if TS version of Controller is enabled
        if (!this.controller.getSceneObject().enabled) return;

        this.sceneObj = this.getSceneObject()

        // Get sync entity for SyncTransform script
        this.syncEntity = SyncEntity.getSyncEntityOnSceneObject(this.sceneObj)

        // Check sync entity is ready before using it
        this.syncEntity.notifyOnReady(() => this.onReady())
    }
}
