import { Snap3D } from "Remote Service Gateway.lspkg/HostedSnap/Snap3D";
import { Snap3DTypes } from "Remote Service Gateway.lspkg/HostedSnap/Snap3DTypes";
import { Snap3DInteractable } from "./Snap3DInteractable";
import { WorldAnchor } from "./WorldAnchor";

import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

@component
export class AnchoredSnap3DFactory extends BaseScriptComponent {
  @ui.separator
  @ui.group_start("Submit and Get Status Example")
  @input
  @widget(new TextAreaWidget())
  private prompt: string = "A cute dog wearing a hat";
  @input
  private refineMesh: boolean = true;
  @input
  private useVertexColor: boolean = false;
  @ui.group_end
  
  @ui.separator
  @ui.group_start("Anchoring Options")
  @input
  @ui.label("Use World Anchoring")
  private useWorldAnchoring: boolean = true;
  
  @input
  @ui.label("Anchor Distance (cm)")
  private anchorDistance: number = 80;
  
  @input
  @ui.label("Allow Manual Repositioning")
  private allowManualRepositioning: boolean = true;
  @ui.group_end
  
  @input
  runOnTap: boolean = false;

  @input
  snap3DInteractablePrefab: ObjectPrefab;

  private avaliableToRequest: boolean = true;
  private wcfmp = WorldCameraFinderProvider.getInstance();
  private createdObjects: SceneObject[] = [];

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
  createAnchoredInteractable3DObject(
    input: string,
    overridePosition?: vec3
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.avaliableToRequest) {
        print("Already processing a request. Please wait.");
        return;
      }
      this.avaliableToRequest = false;
      
      // Create the interactable object
      let outputObj = this.snap3DInteractablePrefab.instantiate(
        this.sceneObject
      );
      outputObj.name = "AnchoredSnap3D - " + input;
      
      // Add WorldAnchor component
      let worldAnchor: WorldAnchor = null;
      if (this.useWorldAnchoring) {
        worldAnchor = outputObj.createComponent(WorldAnchor.getTypeName());
        worldAnchor.anchorDistance = this.anchorDistance;
        worldAnchor.autoAnchorOnAwake = false; // We'll handle anchoring manually
      }
      
      let snap3DInteractable = outputObj.getComponent(
        Snap3DInteractable.getTypeName()
      );
      snap3DInteractable.setPrompt(input);

      // Position the object
      if (overridePosition) {
        outputObj.getTransform().setWorldPosition(overridePosition);
        if (worldAnchor) {
          worldAnchor.anchorToCurrentPosition();
        }
      } else {
        if (worldAnchor) {
          worldAnchor.anchorToForwardPosition();
        } else {
          // Fallback to original positioning
          let newPos = this.wcfmp.getForwardPosition(this.anchorDistance);
          outputObj.getTransform().setWorldPosition(newPos);
        }
      }
      
      // Add to our tracking list
      this.createdObjects.push(outputObj);

      Snap3D.submitAndGetStatus({
        prompt: input,
        format: "glb",
        refine: this.refineMesh,
        use_vertex_color: this.useVertexColor,
      })
        .then((submitGetStatusResults) => {
          submitGetStatusResults.event.add(([value, assetOrError]) => {
            if (value === "image") {
              assetOrError = assetOrError as Snap3DTypes.TextureAssetData;
              snap3DInteractable.setImage(assetOrError.texture);
            } else if (value === "base_mesh") {
              assetOrError = assetOrError as Snap3DTypes.GltfAssetData;
              if (!this.refineMesh) {
                snap3DInteractable.setModel(assetOrError.gltfAsset, true);
                this.avaliableToRequest = true;
                resolve("Successfully created anchored mesh with prompt: " + input);
              } else {
                snap3DInteractable.setModel(assetOrError.gltfAsset, false);
              }
            } else if (value === "refined_mesh") {
              assetOrError = assetOrError as Snap3DTypes.GltfAssetData;
              snap3DInteractable.setModel(assetOrError.gltfAsset, true);
              this.avaliableToRequest = true;
              resolve("Successfully created anchored mesh with prompt: " + input);
            } else if (value === "failed") {
              assetOrError = assetOrError as Snap3DTypes.ErrorData;
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
  private repositionNearestObject(): void {
    if (this.createdObjects.length === 0) {
      print("No objects to reposition");
      return;
    }
    
    const cameraPos = this.wcfmp.getForwardPosition(0); // Get camera position
    let nearestObject: SceneObject = null;
    let nearestDistance = Infinity;
    
    // Find the nearest object
    for (let obj of this.createdObjects) {
      if (!obj) continue;
      
      try {
        const objPos = obj.getTransform().getWorldPosition();
        const distance = cameraPos.distance(objPos);
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestObject = obj;
        }
      } catch (e) {
        // Object might be destroyed, skip it
        continue;
      }
    }
    
    if (nearestObject) {
      const worldAnchor = nearestObject.getComponent(WorldAnchor.getTypeName());
      if (worldAnchor) {
        worldAnchor.anchorToForwardPosition();
        print("Repositioned nearest object to new forward position");
      }
    }
  }
  
  /**
   * Removes all created objects
   */
  clearAllObjects(): void {
    for (let obj of this.createdObjects) {
      if (obj) {
        try {
          obj.destroy();
        } catch (e) {
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
  getActiveObjectCount(): number {
    let count = 0;
    for (let obj of this.createdObjects) {
      if (obj) {
        try {
          // Try to access the transform to check if object is valid
          obj.getTransform();
          count++;
        } catch (e) {
          // Object is destroyed or invalid
        }
      }
    }
    return count;
  }
}