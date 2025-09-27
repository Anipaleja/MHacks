import {Instantiator} from "SpectaclesSyncKit.lspkg/Components/Instantiator"
import {InstantiationOptions} from "SpectaclesSyncKit.lspkg/Components/Instantiator"
import {SessionController } from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {StorageProperty} from "SpectaclesSyncKit.lspkg/Core/StorageProperty"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"
import {SyncKitLogger} from "SpectaclesSyncKit.lspkg/Utils/SyncKitLogger"

@component
export class ControllerTS extends BaseScriptComponent {
    
    @input()
    instantiator: Instantiator
    
    @input()
    xPrefab: ObjectPrefab

    @input()
    oPrefab: ObjectPrefab

    @input()
    showLogs: boolean = true
    
    MAX_TURNS: number = 9
    sceneObj: SceneObject
    isGameOver: boolean = false
    player: String = ""
    syncEntity: SyncEntity

    private turnsProp = StorageProperty.manualInt("turnsCount", 0)
    
    finishTurn() {
        // Increment the turns property    
        if (this.showLogs) {
            print("Turn finished");
        }
        const turnsCount: number = this.turnsProp.currentValue + 1
        this.turnsProp.setPendingValue(turnsCount)    
    }

    onReady() {
        if (this.showLogs) {
            print("Sync entity is ready");
        }
        
        const playerCount: number = SessionController.getInstance().getUsers().length

        // Assign pieces to users
        // The first player is X, the second is O, everyone else is a spectator
        if (playerCount === 1) {
            this.player = "X"
        } else if (playerCount === 2) {
            this.player = "O"
        } else {
            this.player = ""
        }
        
        // If O is assigned, send event to start the game
        if (this.player === "O") {
            this.syncEntity.sendEvent("start")
        }
    }

    setTurn(newCount: number, oldCount: number) {
        // No player has completed a turn yet, don't do anything
        if (newCount === 0) return
        
        // The maximum number of turns have been played, the game is over
        if (newCount === this.MAX_TURNS) {
            this.isGameOver = true
            if (this.showLogs) {
                print("Game is over!")
            }
            return;
        }
        
        // Check whose turn it is and spawn their piece
        if (newCount % 2 === 0 && this.player === "X") {
            this.spawn(this.xPrefab)
        } else if (newCount % 2 === 1 && this.player === "O") {
            this.spawn(this.oPrefab)
        }
    }

    spawn(prefab: ObjectPrefab) {
        if (this.showLogs) {
            print("Spawning " + prefab.name);   
        }
        
        if (this.instantiator.isReady()) {
            // Spawn piece using the Sync Framework instantiator, set local start position
            const options = new InstantiationOptions()
            options.localPosition = new vec3(0,-25,0)
            this.instantiator.instantiate(prefab, options)
        }
    }

    start() {
        if (this.showLogs) {
            print("Start") 
        }
        
        // Player X spawns first piece to start the game
        if (this.player === "X") {
            this.spawn(this.xPrefab)
        }
    }

    onAwake() {
        // Create new sync entity for this script
        this.syncEntity = new SyncEntity(this)

        // Add networked event to start the game
        this.syncEntity.onEventReceived.add("start", () => this.start())

        // Use storage property to keep track of turns, used to figure out whose turn it is
        this.syncEntity.addStorageProperty(this.turnsProp)
        this.turnsProp.onAnyChange.add((newVal: number, oldVal: number) => this.setTurn(newVal, oldVal))

        // Set up the sync entity notify on ready callback
        // Note: Only update the sync entity once it is ready
        this.syncEntity.notifyOnReady(() => this.onReady())
    }
}