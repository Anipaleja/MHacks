import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

/**
 * World position tracker with distance-based visibility
 */
@component
export class PositionAnchor extends BaseScriptComponent {
    @input
    @ui.label("Anchor on Start")
    anchorOnStart: boolean = true;
    
    @input
    @ui.label("Max Visible Distance (cm)")
    maxVisibleDistance: number = 500;
    
    @input
    @ui.label("Fade Start Distance (cm)")
    fadeStartDistance: number = 300;
    
    @input
    @ui.label("Enable Distance Fading")
    enableDistanceFading: boolean = true;
    
    @input
    @ui.label("Show Distance Debug")
    showDistanceDebug: boolean = false;
    
    private worldPosition: vec3 = null;
    private worldRotation: quat = null;
    private isAnchored: boolean = false;
    private wcfmp = WorldCameraFinderProvider.getInstance();
    private originallyVisible: boolean = true;
    private renderMeshVisuals: RenderMeshVisual[] = [];
    
    onAwake() {
        // Cache all render mesh visuals for distance-based visibility
        this.cacheRenderMeshVisuals();
        
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
     * Cache all RenderMeshVisual components for visibility control
     */
    private cacheRenderMeshVisuals(): void {
        this.renderMeshVisuals = [];
        this.findRenderMeshVisuals(this.sceneObject);
    }
    
    /**
     * Recursively find all RenderMeshVisual components
     */
    private findRenderMeshVisuals(obj: SceneObject): void {
        // Check current object
        const renderMesh = obj.getComponent("RenderMeshVisual") as RenderMeshVisual;
        if (renderMesh) {
            this.renderMeshVisuals.push(renderMesh);
        }
        
        // Check children
        for (let i = 0; i < obj.getChildrenCount(); i++) {
            this.findRenderMeshVisuals(obj.getChild(i));
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
     * Check if object has moved from anchor and update visibility based on distance
     */
    update(): void {
        if (this.isAnchored && this.worldPosition) {
            const currentPos = this.getTransform().getWorldPosition();
            const distance = currentPos.distance(this.worldPosition);
            
            // If object has moved more than 1cm from anchor, snap it back
            if (distance > 1.0) {
                this.enforceAnchor();
            }
            
            // Update visibility based on distance to camera
            this.updateVisibilityBasedOnDistance();
        }
    }
    
    /**
     * Update object visibility based on distance to camera
     */
    private updateVisibilityBasedOnDistance(): void {
        if (!this.enableDistanceFading || !this.worldPosition) {
            return;
        }
        
        // Get camera position
        const cameraPos = this.wcfmp.getForwardPosition(0);
        const distanceToCamera = this.worldPosition.distance(cameraPos);
        
        // Debug distance if enabled
        if (this.showDistanceDebug) {
            print(`Distance to ${this.sceneObject.name}: ${distanceToCamera.toFixed(1)}cm`);
        }
        
        // Determine visibility and opacity
        let targetOpacity = 1.0;
        let shouldBeVisible = true;
        
        if (distanceToCamera > this.maxVisibleDistance) {
            // Too far - completely invisible
            shouldBeVisible = false;
            targetOpacity = 0.0;
        } else if (distanceToCamera > this.fadeStartDistance) {
            // In fade range - calculate opacity
            const fadeRange = this.maxVisibleDistance - this.fadeStartDistance;
            const fadeProgress = (distanceToCamera - this.fadeStartDistance) / fadeRange;
            targetOpacity = 1.0 - fadeProgress;
            shouldBeVisible = targetOpacity > 0.1; // Keep visible if opacity > 10%
        }
        
        // Apply visibility changes
        this.setObjectVisibility(shouldBeVisible, targetOpacity);
    }
    
    /**
     * Set the visibility and opacity of the object
     */
    private setObjectVisibility(visible: boolean, opacity: number): void {
        // Update SceneObject enabled state
        if (this.sceneObject.enabled !== visible) {
            this.sceneObject.enabled = visible;
        }
        
        // Update opacity of render mesh visuals
        for (let renderMesh of this.renderMeshVisuals) {
            if (renderMesh && renderMesh.getMaterial(0)) {
                const material = renderMesh.getMaterial(0);
                if (material.mainPass) {
                    material.mainPass.baseColor = new vec4(
                        material.mainPass.baseColor.r,
                        material.mainPass.baseColor.g,
                        material.mainPass.baseColor.b,
                        opacity
                    );
                }
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
    
    /**
     * Get current distance to camera
     */
    getDistanceToCamera(): number {
        if (!this.worldPosition) return -1;
        
        const cameraPos = this.wcfmp.getForwardPosition(0);
        return this.worldPosition.distance(cameraPos);
    }
    
    /**
     * Check if object is currently visible based on distance
     */
    isVisibleByDistance(): boolean {
        if (!this.enableDistanceFading) return true;
        
        const distance = this.getDistanceToCamera();
        return distance <= this.maxVisibleDistance;
    }
    
    /**
     * Set distance parameters
     */
    setDistanceParameters(maxVisible: number, fadeStart: number): void {
        this.maxVisibleDistance = maxVisible;
        this.fadeStartDistance = fadeStart;
    }
    
    /**
     * Force refresh visibility based on current distance
     */
    refreshVisibility(): void {
        this.updateVisibilityBasedOnDistance();
    }
}