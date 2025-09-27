import { Snap3D } from "Remote Service Gateway.lspkg/HostedSnap/Snap3D";
import { Snap3DTypes } from "Remote Service Gateway.lspkg/HostedSnap/Snap3DTypes";
import { Snap3DInteractable } from "./Snap3DInteractable";
import { PositionAnchor } from "./PositionAnchor";

import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

@component
export class EnhancedSnap3DFactory extends BaseScriptComponent {
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
  @ui.group_start("World Anchoring")
  @input
  @ui.label("Enable World Anchoring")
  private enableAnchoring: boolean = true;
  
  @input
  @ui.label("Placement Distance (cm)")
  private placementDistance: number = 80;
  @ui.group_end
  
  @input
  runOnTap: boolean = false;

  @input
  snap3DInteractablePrefab: ObjectPrefab;

  private avaliableToRequest: boolean = true;
  private wcfmp = WorldCameraFinderProvider.getInstance();

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
  createAnchoredObject(input: string, overridePosition?: vec3): Promise<string> {
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
      let snap3DInteractable = outputObj.getComponent(Snap3DInteractable.getTypeName());
      snap3DInteractable.setPrompt(input);

      // Add anchoring if enabled
      if (this.enableAnchoring) {
        let positionAnchor = outputObj.createComponent(PositionAnchor.getTypeName());
        positionAnchor.anchorOnStart = false; // We'll position it manually
        
        if (overridePosition) {
          positionAnchor.anchorToWorldPosition(overridePosition);
        } else {
          positionAnchor.anchorToForwardPosition(this.placementDistance);
        }
      } else {
        // Use original positioning method
        if (overridePosition) {
          outputObj.getTransform().setWorldPosition(overridePosition);
        } else {
          let newPos = this.wcfmp.getForwardPosition(this.placementDistance);
          outputObj.getTransform().setWorldPosition(newPos);
        }
      }

      // Submit the 3D generation request
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
                resolve("Successfully created anchored 3D object: " + input);
              } else {
                snap3DInteractable.setModel(assetOrError.gltfAsset, false);
              }
            } else if (value === "refined_mesh") {
              assetOrError = assetOrError as Snap3DTypes.GltfAssetData;
              snap3DInteractable.setModel(assetOrError.gltfAsset, true);
              this.avaliableToRequest = true;
              resolve("Successfully created anchored 3D object: " + input);
            } else if (value === "failed") {
              assetOrError = assetOrError as Snap3DTypes.ErrorData;
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
  public generateAnchoredObject(prompt: string, position?: vec3): Promise<string> {
    return this.createAnchoredObject(prompt, position);
  }
}