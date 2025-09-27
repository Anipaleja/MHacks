import animate, { CancelSet } from "SpectaclesInteractionKit.lspkg/Utils/animate";

@component
export class AnimateOpacity extends BaseScriptComponent {

    @input
    public animDelay: number = 0.05
    @input
    public animDuration: number = 1

    private textC: Text
    private mainMaterial: Material

    private delayedAnim:DelayedCallbackEvent
    private delayedAnimCancelset:CancelSet = new CancelSet()
    
    @input
    public isTexture: boolean = false

    onAwake() {
        this.createEvent("OnEnableEvent").bind(this.onEnable.bind(this));
        
        if (!this.isTexture) {
            this.textC = this.getSceneObject().getComponent("Component.Text")
        }
        else {
            this.mainMaterial = this.getSceneObject().getComponent("Component.Image").mainMaterial
        }
        
        if (this.animDelay && this.animDelay > 0) {
            this.delayedAnim = this.createEvent("DelayedCallbackEvent")
            this.delayedAnim.bind(() => {
                this.setColorAlpha(0)
                this.delayedAnimCancelset.cancel()
                animate({
                    cancelSet: this.delayedAnimCancelset,
                    duration: this.animDuration,
                    easing: "ease-out-cubic",
                    update: (t) => {
                        this.setColorAlpha(1-t)
                    }
                })        
            })
        }

        this.animateOpacity()
    }

    onEnable() {
        this.animateOpacity()
    }

    animateOpacity() {
        //this.setColorAlpha(0)
        if (this.animDelay && this.animDelay > 0) {
            this.delayedAnimCancelset.cancel()
            this.delayedAnim.reset(this.animDelay)
        }
        else {
            this.delayedAnimCancelset.cancel()
            animate({
                cancelSet: this.delayedAnimCancelset,
                duration: this.animDuration,
                easing: "ease-out-cubic",
                update: (t) => {
                    this.setColorAlpha(t)
                }
            })
        }
    }

    animateOut () {
        this.delayedAnimCancelset.cancel()
        animate({
            cancelSet: this.delayedAnimCancelset,
            duration: this.animDuration,
            easing: "ease-out-cubic",
            update: (t) => {
                this.setColorAlpha(1 - t)
                if (t > 0.99) {
                    this.delayedAnimCancelset.cancel()
                    this.enabled = false
                    this.getSceneObject().enabled = false
                }
            }
        })
    }

    setColor (color: vec4) {
        if (this.isTexture) {
            this.mainMaterial.mainPass.baseColor = color
        }
        else {
            this.textC.textFill.color = color
        }
    }

    setColorAlpha (alpha: number) {
        if (this.isTexture) {
            this.mainMaterial.mainPass.baseColor = new vec4(this.mainMaterial.mainPass.baseColor.r,
                this.mainMaterial.mainPass.baseColor.g,
                this.mainMaterial.mainPass.baseColor.b, alpha)
        }
        else {
            this.textC.textFill.color = new vec4(this.textC.textFill.color.r,
            this.textC.textFill.color.g,
            this.textC.textFill.color.b, alpha)
        }
    }

    getColor ():vec4 {
        if (this.isTexture) {
            return this.mainMaterial.mainPass.baseColor
        }
        return this.textC.textFill.color
    }


}
