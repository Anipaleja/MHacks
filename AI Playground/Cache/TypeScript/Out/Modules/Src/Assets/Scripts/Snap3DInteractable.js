"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snap3DInteractable = void 0;
var __selfType = requireType("./Snap3DInteractable");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const FunctionTimingUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils");
let Snap3DInteractable = class Snap3DInteractable extends BaseScriptComponent {
    onAwake() {
        // Clone the image material to avoid modifying the original
        let imgMaterial = this.img.mainMaterial;
        imgMaterial.mainPass.baseTex = this.img.mainPass.baseTex;
        this.img.enabled = false;
        let offsetBelow = 0;
        this.sizeVec = vec3.one().uniformScale(this.size);
        this.displayPlate
            .getTransform()
            .setLocalPosition(new vec3(0, -this.size * 0.5 - offsetBelow, 0));
        this.colliderObj.getTransform().setLocalScale(this.sizeVec);
        this.img.getTransform().setLocalScale(this.sizeVec);
    }
    setPrompt(prompt) {
        this.promptDisplay.text = prompt;
    }
    setImage(image) {
        this.img.enabled = true;
        this.img.mainPass.baseTex = image;
    }
    setModel(model, isFinal) {
        this.img.enabled = false;
        if (isFinal) {
            if (!isNull(this.finalModel)) {
                this.finalModel.destroy();
            }
            this.spinner.enabled = false;
            this.finalModel = model.tryInstantiate(this.modelParent, this.mat);
            this.finalModel.getTransform().setLocalScale(this.sizeVec);
        }
        else {
            this.tempModel = model.tryInstantiate(this.modelParent, this.mat);
            this.tempModel.getTransform().setLocalScale(this.sizeVec);
        }
    }
    onFailure(error) {
        this.img.enabled = false;
        this.spinner.enabled = false;
        if (this.tempModel) {
            this.tempModel.destroy();
        }
        if (this.finalModel) {
            this.finalModel.destroy();
        }
        this.promptDisplay.text = "Error: " + error;
        (0, FunctionTimingUtils_1.setTimeout)(() => {
            this.destroy();
        }, 5000); // Hide error after 5 seconds
    }
    __initialize() {
        super.__initialize();
        this.tempModel = null;
        this.finalModel = null;
        this.size = 20;
        this.sizeVec = null;
    }
};
exports.Snap3DInteractable = Snap3DInteractable;
exports.Snap3DInteractable = Snap3DInteractable = __decorate([
    component
], Snap3DInteractable);
//# sourceMappingURL=Snap3DInteractable.js.map