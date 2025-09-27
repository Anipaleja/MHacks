import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

/**
 * Simple world position tracker that keeps objects in fixed world locations
 */
@component
export class PositionAnchor extends BaseScriptComponent {
    @input
    @ui.label("Anchor on Start")
    private anchorOnStart: boolean = true;
    
    private worldPosition: vec3 = null;
    private worldRotation: quat = null;
    private isAnchored: boolean = false;
    private wcfmp = WorldCameraFinderProvider.getInstance();
    
    onAwake() {
        if (this.anchorOnStart) {
            // Use event to delay initialization
            this.createEvent("UpdateEvent").bind(() => {
                if (!this.isAnchored) {
                    this.setAnchorPosition();
                }
            });
        }
    }
    
    /**
     * Sets the current position as the anchor point
     */
    setAnchorPosition(): void {
        this.worldPosition = this.getTransform().getWorldPosition();
        this.worldRotation = this.getTransform().getWorldRotation();
        this.isAnchored = true;
        print(`Position anchored at: ${this.worldPosition.toString()}`);
    }
    
    /**
     * Anchors to a position in front of the camera
     */
    anchorToForwardPosition(distance: number = 80): void {
        const forwardPos = this.wcfmp.getForwardPosition(distance);
        this.getTransform().setWorldPosition(forwardPos);
        this.setAnchorPosition();
    }
    
    /**
     * Anchors to a specific world position
     */
    anchorToWorldPosition(position: vec3, rotation?: quat): void {
        this.worldPosition = position;
        this.worldRotation = rotation || this.getTransform().getWorldRotation();
        this.isAnchored = true;
        this.getTransform().setWorldPosition(this.worldPosition);
        if (this.worldRotation) {
            this.getTransform().setWorldRotation(this.worldRotation);
        }
        print(`Anchored to world position: ${this.worldPosition.toString()}`);
    }
    
    /**
     * Removes the anchor
     */
    removeAnchor(): void {
        this.isAnchored = false;
        this.worldPosition = null;
        this.worldRotation = null;
        print("Anchor removed");
    }
    
    /**
     * Forces the object back to its anchored position
     */
    enforceAnchor(): void {
        if (this.isAnchored && this.worldPosition) {
            this.getTransform().setWorldPosition(this.worldPosition);
            if (this.worldRotation) {
                this.getTransform().setWorldRotation(this.worldRotation);
            }
        }
    }
    
    /**
     * Check if object has moved from anchor and correct if needed
     */
    update(): void {
        if (this.isAnchored && this.worldPosition) {
            const currentPos = this.getTransform().getWorldPosition();
            const distance = currentPos.distance(this.worldPosition);
            
            // If object has moved more than 1cm from anchor, snap it back
            if (distance > 1.0) {
                this.enforceAnchor();
            }
        }
    }
    
    /**
     * Returns whether the object is anchored
     */
    getIsAnchored(): boolean {
        return this.isAnchored;
    }
    
    /**
     * Returns the anchor position
     */
    getAnchorPosition(): vec3 | null {
        return this.worldPosition;
    }
}