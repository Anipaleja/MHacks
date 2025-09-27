import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";

@component
export class AnimateOpacity extends BaseScriptComponent {

    public animDelay: number = 0.5
    public animDuration: number = 1
    private meshVis:RenderMeshVisual

    onAwake() {
        this.createEvent("OnEnableEvent").bind(this.onEnable.bind(this));
        this.meshVis = this.getSceneObject().getComponent("Component.RenderMeshVisual")
        this.animateOpacity()
    }

    onEnable() {
        this.animateOpacity()
    }

    animateOpacity() {
        animate({
            duration: this.animDuration,
            easing: "ease-out-cubic",
            update: (t) => {
                let cColor = this.meshVis.mainPass.baseColor
                this.meshVis.mainPass.baseColor = new vec4(cColor.r,
                    cColor.g, cColor.b, t)
            }
        })
    }
}
