import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

@component
export class ScreenLogger extends BaseScriptComponent {
    

    debugText:Text
    private static instance: ScreenLogger

    @input
    @allowUndefined
    public debugCube: ObjectPrefab

    public static getInstance(): ScreenLogger {
        if (!ScreenLogger.instance) {
          return null
        }
        return ScreenLogger.instance
    }

    onAwake() {
        ScreenLogger.instance = this
        this.createComponent()
    }

    createComponent() {
        let loggerObj = global.scene.createSceneObject('ScreenLogger')
        WorldCameraFinderProvider.getInstance().attachSceneObject(loggerObj)
        this.debugText = loggerObj.createComponent("Text")
        this.debugText.getTransform().setLocalPosition(new vec3(16, 24, -110))
        this.debugText.horizontalAlignment = HorizontalAlignment.Right
        this.debugText.size = 54
        this.debugText.text = "N/A"
    }

    public log (nText) {
        this.debugText.text = nText
    }
}
