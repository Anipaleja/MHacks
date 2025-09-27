"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchoredSnap3DFactory = void 0;
var __selfType = requireType("./AnchoredSnap3DFactory");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Snap3D_1 = require("Remote Service Gateway.lspkg/HostedSnap/Snap3D");
const Snap3DInteractable_1 = require("./Snap3DInteractable");
const WorldAnchor_1 = require("./WorldAnchor");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
let AnchoredSnap3DFactory = class AnchoredSnap3DFactory extends BaseScriptComponent {
    onAwake() {
        this.createEvent("TapEvent").bind(() => {
            if (!this.runOnTap) {
                return;
            }
            this.createAnchoredInteractable3DObject(this.prompt);
        });
        // Add touch event for repositioning existing objects
        if (this.allowManualRepositioning) {
            this.createEvent("TouchEndEvent").bind(() => {
                // Simple touch gesture for repositioning - could be enhanced with gesture detection
                this.repositionNearestObject();
            });
        }
    }
    /**
     * Creates a new 3D object that will be anchored to the world
     */
    createAnchoredInteractable3DObject(input, overridePosition) {
        return new Promise((resolve, reject) => {
            if (!this.avaliableToRequest) {
                print("Already processing a request. Please wait.");
                return;
            }
            this.avaliableToRequest = false;
            // Create the interactable object
            let outputObj = this.snap3DInteractablePrefab.instantiate(this.sceneObject);
            outputObj.name = "AnchoredSnap3D - " + input;
            // Add WorldAnchor component
            let worldAnchor = null;
            if (this.useWorldAnchoring) {
                worldAnchor = outputObj.createComponent(WorldAnchor_1.WorldAnchor.getTypeName());
                worldAnchor.anchorDistance = this.anchorDistance;
                worldAnchor.autoAnchorOnAwake = false; // We'll handle anchoring manually
            }
            let snap3DInteractable = outputObj.getComponent(Snap3DInteractable_1.Snap3DInteractable.getTypeName());
            snap3DInteractable.setPrompt(input);
            // Position the object
            if (overridePosition) {
                outputObj.getTransform().setWorldPosition(overridePosition);
                if (worldAnchor) {
                    worldAnchor.anchorToCurrentPosition();
                }
            }
            else {
                if (worldAnchor) {
                    worldAnchor.anchorToForwardPosition();
                }
                else {
                    // Fallback to original positioning
                    let newPos = this.wcfmp.getForwardPosition(this.anchorDistance);
                    outputObj.getTransform().setWorldPosition(newPos);
                }
            }
            // Add to our tracking list
            this.createdObjects.push(outputObj);
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
                            resolve("Successfully created anchored mesh with prompt: " + input);
                        }
                        else {
                            snap3DInteractable.setModel(assetOrError.gltfAsset, false);
                        }
                    }
                    else if (value === "refined_mesh") {
                        assetOrError = assetOrError;
                        snap3DInteractable.setModel(assetOrError.gltfAsset, true);
                        this.avaliableToRequest = true;
                        resolve("Successfully created anchored mesh with prompt: " + input);
                    }
                    else if (value === "failed") {
                        assetOrError = assetOrError;
                        print("Error: " + assetOrError.errorMsg);
                        this.avaliableToRequest = true;
                        reject("Failed to create anchored mesh with prompt: " + input);
                    }
                });
            })
                .catch((error) => {
                snap3DInteractable.onFailure(error);
                print("Error submitting task or getting status: " + error);
                this.avaliableToRequest = true;
                reject("Failed to create anchored mesh with prompt: " + input);
            });
        });
    }
    /**
     * Repositions the nearest anchored object to a new position in front of the camera
     */
    repositionNearestObject() {
        if (this.createdObjects.length === 0) {
            print("No objects to reposition");
            return;
        }
        const cameraPos = this.wcfmp.getForwardPosition(0); // Get camera position
        let nearestObject = null;
        let nearestDistance = Infinity;
        // Find the nearest object
        for (let obj of this.createdObjects) {
            if (!obj)
                continue;
            try {
                const objPos = obj.getTransform().getWorldPosition();
                const distance = cameraPos.distance(objPos);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestObject = obj;
                }
            }
            catch (e) {
                // Object might be destroyed, skip it
                continue;
            }
        }
        if (nearestObject) {
            const worldAnchor = nearestObject.getComponent(WorldAnchor_1.WorldAnchor.getTypeName());
            if (worldAnchor) {
                worldAnchor.anchorToForwardPosition();
                print("Repositioned nearest object to new forward position");
            }
        }
    }
    /**
     * Removes all created objects
     */
    clearAllObjects() {
        for (let obj of this.createdObjects) {
            if (obj) {
                try {
                    obj.destroy();
                }
                catch (e) {
                    // Object might already be destroyed
                }
            }
        }
        this.createdObjects = [];
        print("All anchored objects cleared");
    }
    /**
     * Returns the number of currently active objects
     */
    getActiveObjectCount() {
        let count = 0;
        for (let obj of this.createdObjects) {
            if (obj) {
                try {
                    // Try to access the transform to check if object is valid
                    obj.getTransform();
                    count++;
                }
                catch (e) {
                    // Object is destroyed or invalid
                }
            }
        }
        return count;
    }
    __initialize() {
        super.__initialize();
        this.avaliableToRequest = true;
        this.wcfmp = WorldCameraFinderProvider_1.default.getInstance();
        this.createdObjects = [];
    }
};
exports.AnchoredSnap3DFactory = AnchoredSnap3DFactory;
exports.AnchoredSnap3DFactory = AnchoredSnap3DFactory = __decorate([
    component
], AnchoredSnap3DFactory);
//# sourceMappingURL=AnchoredSnap3DFactory.js.map