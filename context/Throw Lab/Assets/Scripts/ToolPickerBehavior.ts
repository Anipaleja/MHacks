import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { ContainerFrame } from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"

@component
export class ToolPickerBehavior extends BaseScriptComponent {

    @input
    public toolPrefabs:ObjectPrefab[]

    @input
    public toolSpawnPoints:SceneObject[]
    public toolSpawnPointsT:Transform[]

    private latestObj:SceneObject[]
    private latestObjT:Transform[]

    private yOffset = 5
    private distanceOffset = 15

    @input
    public containerObj:SceneObject

    onAwake() {
        this.init()
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
    }

    init () {
        this.toolSpawnPointsT = []
        this.latestObj = []
        this.latestObjT = []
        this.spanwAllTools()
    }

    spanwAllTools () {
        this.toolSpawnPoints.forEach((value, ind) => {
            let spawnPoint = value
            this.toolSpawnPointsT[ind] = spawnPoint.getTransform()
            this.spawnAndReplace(ind)
        })
    }

    onUpdate () {
        this.toolSpawnPoints.forEach((value, ind) => {
            let spawnPointT = this.toolSpawnPointsT[ind]
            let objectT = this.latestObjT[ind]

            if (objectT.getWorldPosition().distance(spawnPointT.getWorldPosition()) 
                > this.distanceOffset) {
                objectT.getSceneObject().setParent(null)
                this.spawnAndReplace(ind)
            }
        })
    }

    spawnAndReplace (ind) {
        let spawnPos =  this.toolSpawnPointsT[ind].getWorldPosition()
        spawnPos.y += this.yOffset

        let nObject = this.toolPrefabs[ind].instantiate(this.containerObj)
        nObject.enabled = true
        nObject.getTransform().setWorldPosition(spawnPos)

        this.latestObj[ind] = nObject
        this.latestObjT[ind] = nObject.getTransform()
    }
}
