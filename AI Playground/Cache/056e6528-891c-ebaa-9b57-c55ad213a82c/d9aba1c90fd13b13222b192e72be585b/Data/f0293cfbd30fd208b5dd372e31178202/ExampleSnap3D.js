"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleSnap3D = void 0;
var __selfType = requireType("./ExampleSnap3D");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Snap3D_1 = require("../Snap3D");
let ExampleSnap3D = class ExampleSnap3D extends BaseScriptComponent {
    onAwake() {
        this.initalizeSpinners();
        this.imageRoot.enabled = false;
        if (global.deviceInfoSystem.isEditor()) {
            this.createEvent("TapEvent").bind(() => {
                this.onTap();
            });
        }
        else {
            this.gestureModule
                .getPinchDownEvent(GestureModule.HandType.Right)
                .add(() => {
                this.onTap();
            });
        }
    }
    onTap() {
        if (!this.runOnTap) {
            return;
        }
        if (!this.avaliableToRequest) {
            return;
        }
        this.avaliableToRequest = false;
        this.resetAssets();
        this.hintText.text = "Requested Snap3D generation. Please wait...";
        this.enableSpinners(true);
        Snap3D_1.Snap3D.submitAndGetStatus({
            prompt: this.prompt,
            format: "glb",
            refine: this.refineMesh,
            use_vertex_color: this.useVertexColor,
        })
            .then((submitGetStatusResults) => {
            submitGetStatusResults.event.add(([value, assetOrError]) => {
                if (value === "image") {
                    this.generateImageAsset(assetOrError);
                }
                else if (value === "base_mesh") {
                    this.generateBaseMeshAsset(assetOrError);
                }
                else if (value === "refined_mesh") {
                    this.generateRefinedMeshAsset(assetOrError);
                }
                else if (value === "failed") {
                    this.enableSpinners(false);
                    let error = assetOrError;
                    print("Task failed with error: " +
                        error.errorMsg +
                        " (Code: " +
                        error.errorCode +
                        ")");
                    this.hintText.text =
                        "Generation failed. Please Tap or Pinch to try again.";
                    this.avaliableToRequest = true;
                }
            });
        })
            .catch((error) => {
            this.hintText.text =
                "Generation failed. Please Tap or Pinch to try again.";
            print("Error submitting task or getting status: " + error);
            this.avaliableToRequest = true;
        });
    }
    generateImageAsset(textureAssetData) {
        this.imageRoot.mainPass.baseTex = textureAssetData.texture;
        this.loaderSpinnerImage.enabled = false;
        this.imageRoot.enabled = true;
    }
    generateBaseMeshAsset(gltfAssetData) {
        this.baseMeshSceneObject = gltfAssetData.gltfAsset.tryInstantiate(this.baseMeshRoot, this.modelMat);
        this.baseMeshSpinner.enabled = false;
    }
    generateRefinedMeshAsset(gltfAssetData) {
        this.refinedMeshSceneObject = gltfAssetData.gltfAsset.tryInstantiate(this.refinedMeshRoot, this.modelMat);
        this.refinedMeshSpinner.enabled = false;
        this.hintText.text =
            "Generation Completed. Please Tap or Pinch to try again.";
        this.avaliableToRequest = true;
    }
    resetAssets() {
        this.imageRoot.enabled = false;
        if (!isNull(this.baseMeshSceneObject)) {
            this.baseMeshSceneObject.destroy();
            this.baseMeshSceneObject = null;
        }
        if (!isNull(this.refinedMeshSceneObject)) {
            this.refinedMeshSceneObject.destroy();
            this.refinedMeshSceneObject = null;
        }
    }
    initalizeSpinners() {
        this.loaderSpinnerImage = this.imageRoot.sceneObject.getChild(1);
        this.baseMeshSpinner = this.baseMeshRoot.getChild(1);
        this.refinedMeshSpinner = this.refinedMeshRoot.getChild(1);
        this.enableSpinners(false);
    }
    enableSpinners(enable) {
        this.loaderSpinnerImage.enabled = enable;
        this.baseMeshSpinner.enabled = enable;
        this.refinedMeshSpinner.enabled = enable;
    }
    __initialize() {
        super.__initialize();
        this.baseMeshSceneObject = null;
        this.refinedMeshSceneObject = null;
        this.avaliableToRequest = true;
        this.gestureModule = require("LensStudio:GestureModule");
    }
};
exports.ExampleSnap3D = ExampleSnap3D;
exports.ExampleSnap3D = ExampleSnap3D = __decorate([
    component
], ExampleSnap3D);
//# sourceMappingURL=ExampleSnap3D.js.map