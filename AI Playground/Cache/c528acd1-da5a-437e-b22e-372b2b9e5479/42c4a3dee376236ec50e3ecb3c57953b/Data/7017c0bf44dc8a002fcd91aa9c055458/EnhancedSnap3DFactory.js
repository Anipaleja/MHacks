"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedSnap3DFactory = void 0;
var __selfType = requireType("./EnhancedSnap3DFactory");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Snap3D_1 = require("Remote Service Gateway.lspkg/HostedSnap/Snap3D");
const Snap3DInteractable_1 = require("./Snap3DInteractable");
const PositionAnchor_1 = require("./PositionAnchor");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
let EnhancedSnap3DFactory = class EnhancedSnap3DFactory extends BaseScriptComponent {
    onAwake() {
        this.createEvent("TapEvent").bind(() => {
            if (!this.runOnTap) {
                return;
            }
            this.createAnchoredObject(this.prompt);
        });
    }
    /**
     * Creates a new 3D object with world anchoring
     */
    createAnchoredObject(input, overridePosition) {
        return new Promise((resolve, reject) => {
            if (!this.avaliableToRequest) {
                print("Already processing a request. Please wait.");
                return;
            }
            this.avaliableToRequest = false;
            // Create the base object
            let outputObj = this.snap3DInteractablePrefab.instantiate(this.sceneObject);
            outputObj.name = "Anchored3D - " + input;
            // Get the Snap3DInteractable component
            let snap3DInteractable = outputObj.getComponent(Snap3DInteractable_1.Snap3DInteractable.getTypeName());
            snap3DInteractable.setPrompt(input);
            // Add anchoring if enabled
            if (this.enableAnchoring) {
                let positionAnchor = outputObj.createComponent(PositionAnchor_1.PositionAnchor.getTypeName());
                positionAnchor.anchorOnStart = false; // We'll position it manually
                if (overridePosition) {
                    positionAnchor.anchorToWorldPosition(overridePosition);
                }
                else {
                    positionAnchor.anchorToForwardPosition(this.placementDistance);
                }
            }
            else {
                // Use original positioning method
                if (overridePosition) {
                    outputObj.getTransform().setWorldPosition(overridePosition);
                }
                else {
                    let newPos = this.wcfmp.getForwardPosition(this.placementDistance);
                    outputObj.getTransform().setWorldPosition(newPos);
                }
            }
            // Submit the 3D generation request
            Snap3D_1.Snap3D.submitAndGetStatus({
                prompt: input,
                format: "glb",
                refine: this.refineMesh,
                use_vertex_color: this.useVertexColor,
            })
                .then((submitGetStatusResults) => {
                submitGetStatusResults.event.add(([value, assetOrError]) => {
                    if (value === "image") {
                        assetOrError = assetOrError;
                        snap3DInteractable.setImage(assetOrError.texture);
                    }
                    else if (value === "base_mesh") {
                        assetOrError = assetOrError;
                        if (!this.refineMesh) {
                            snap3DInteractable.setModel(assetOrError.gltfAsset, true);
                            this.avaliableToRequest = true;
                            resolve("Successfully created anchored 3D object: " + input);
                        }
                        else {
                            snap3DInteractable.setModel(assetOrError.gltfAsset, false);
                        }
                    }
                    else if (value === "refined_mesh") {
                        assetOrError = assetOrError;
                        snap3DInteractable.setModel(assetOrError.gltfAsset, true);
                        this.avaliableToRequest = true;
                        resolve("Successfully created anchored 3D object: " + input);
                    }
                    else if (value === "failed") {
                        assetOrError = assetOrError;
                        print("Error: " + assetOrError.errorMsg);
                        this.avaliableToRequest = true;
                        reject("Failed to create 3D object: " + input);
                    }
                });
            })
                .catch((error) => {
                snap3DInteractable.onFailure(error);
                print("Error submitting task or getting status: " + error);
                this.avaliableToRequest = true;
                reject("Failed to create 3D object: " + input);
            });
        });
    }
    /**
     * Public method to create objects from other scripts
     */
    generateAnchoredObject(prompt, position) {
        return this.createAnchoredObject(prompt, position);
    }
    __initialize() {
        super.__initialize();
        this.avaliableToRequest = true;
        this.wcfmp = WorldCameraFinderProvider_1.default.getInstance();
    }
};
exports.EnhancedSnap3DFactory = EnhancedSnap3DFactory;
exports.EnhancedSnap3DFactory = EnhancedSnap3DFactory = __decorate([
    component
], EnhancedSnap3DFactory);
//# sourceMappingURL=EnhancedSnap3DFactory.js.map