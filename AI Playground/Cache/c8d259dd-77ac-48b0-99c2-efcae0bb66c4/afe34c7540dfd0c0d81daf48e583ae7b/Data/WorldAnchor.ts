import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

/**
 * Component that anchors objects to specific world positions, making them stay in place
 * even when the user moves to different rooms or locations.
 */
@component
export class WorldAnchor extends BaseScriptComponent {
    @input
    @ui.label("Anchor Distance (cm)")
    anchorDistance: number = 80;
    
    @input
    @ui.label("Auto Anchor on Awake")
    autoAnchorOnAwake: boolean = true;
    
    @input
    @ui.label("Use Current Position as Anchor")
    useCurrentPosition: boolean = false;
    
    private wcfmp = WorldCameraFinderProvider.getInstance();
    private isAnchored: boolean = false;
    private anchorPosition: vec3 = null;
    private anchorRotation: quat = null;
    
    onAwake() {
        if (this.autoAnchorOnAwake) {
            if (this.useCurrentPosition) {
                this.anchorToCurrentPosition();
            } else {
                this.anchorToForwardPosition();
            }
        }
    }
    
    /**
     * Anchors the object to its current world position
     */
    anchorToCurrentPosition(): void {
        this.anchorPosition = this.getTransform().getWorldPosition();
        this.anchorRotation = this.getTransform().getWorldRotation();
        this.isAnchored = true;
        this.applyAnchorPosition();
        print(`Object anchored to current position: ${this.anchorPosition.toString()}`);
    }
    
    /**
     * Anchors the object to a position in front of the camera
     */
    anchorToForwardPosition(): void {
        const forwardPos = this.wcfmp.getForwardPosition(this.anchorDistance);
        this.anchorPosition = forwardPos;
        this.anchorRotation = this.getTransform().getWorldRotation();
        this.isAnchored = true;
        this.applyAnchorPosition();
        print(`Object anchored to forward position: ${this.anchorPosition.toString()}`);
    }
    
    /**
     * Anchors the object to a specific world position
     */
    anchorToPosition(position: vec3, rotation?: quat): void {
        this.anchorPosition = position;
        this.anchorRotation = rotation || this.getTransform().getWorldRotation();
        this.isAnchored = true;
        this.applyAnchorPosition();
        print(`Object anchored to specified position: ${this.anchorPosition.toString()}`);
    }
    
    /**
     * Removes the anchor, allowing the object to move freely
     */
    removeAnchor(): void {
        this.isAnchored = false;
        this.anchorPosition = null;
        this.anchorRotation = null;
        print("Object anchor removed");
    }
    
    /**
     * Applies the anchor position to the object
     */
    private applyAnchorPosition(): void {
        if (this.isAnchored && this.anchorPosition) {
            this.getTransform().setWorldPosition(this.anchorPosition);
            if (this.anchorRotation) {
                this.getTransform().setWorldRotation(this.anchorRotation);
            }
        }
    }
    
    /**
     * Returns whether the object is currently anchored
     */
    getIsAnchored(): boolean {
        return this.isAnchored;
    }
    
    /**
     * Returns the current anchor position (if anchored)
     */
    getAnchorPosition(): vec3 | null {
        return this.anchorPosition;
    }
    
    /**
     * Returns the current anchor rotation (if anchored)
     */
    getAnchorRotation(): quat | null {
        return this.anchorRotation;
    }
    
    /**
     * Updates the anchor distance and re-anchors if currently anchored
     */
    setAnchorDistance(distance: number): void {
        this.anchorDistance = distance;
        if (this.isAnchored && !this.useCurrentPosition) {
            this.anchorToForwardPosition();
        }
    }
}