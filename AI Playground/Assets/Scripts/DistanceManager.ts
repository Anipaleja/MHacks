import { PositionAnchor } from "./PositionAnchor";

/**
 * Manages distance-based visibility for multiple anchored objects
 */
@component
export class DistanceManager extends BaseScriptComponent {
    @input
    @ui.label("Global Max Distance (cm)")
    globalMaxDistance: number = 500;
    
    @input
    @ui.label("Global Fade Distance (cm)")
    globalFadeDistance: number = 300;
    
    @input
    @ui.label("Update Interval (seconds)")
    updateInterval: number = 0.1;
    
    @input
    @ui.label("Show Distance Info")
    showDistanceInfo: boolean = false;
    
    private trackedAnchors: PositionAnchor[] = [];
    private lastUpdateTime: number = 0;
    
    onAwake() {
        // Find all PositionAnchor components in the scene
        this.findAllAnchors();
        
        this.createEvent("UpdateEvent").bind(() => {
            this.updateDistances();
        });
    }
    
    /**
     * Find all PositionAnchor components in the scene
     */
    private findAllAnchors(): void {
        this.trackedAnchors = [];
        this.searchForAnchors(this.sceneObject.getParent());
    }
    
    /**
     * Recursively search for PositionAnchor components
     */
    private searchForAnchors(obj: SceneObject): void {
        if (!obj) return;
        
        const anchor = obj.getComponent(PositionAnchor.getTypeName()) as PositionAnchor;
        if (anchor) {
            this.trackedAnchors.push(anchor);
        }
        
        for (let i = 0; i < obj.getChildrenCount(); i++) {
            this.searchForAnchors(obj.getChild(i));
        }
    }
    
    /**
     * Update distances for all tracked anchors
     */
    private updateDistances(): void {
        const currentTime = getTime();
        
        // Throttle updates based on interval
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return;
        }
        
        this.lastUpdateTime = currentTime;
        
        let visibleCount = 0;
        let totalCount = 0;
        
        for (let anchor of this.trackedAnchors) {
            if (anchor && anchor.getIsAnchored()) {
                totalCount++;
                
                if (anchor.isVisibleByDistance()) {
                    visibleCount++;
                }
            }
        }
        
        if (this.showDistanceInfo && totalCount > 0) {
            print(`Distance Manager: ${visibleCount}/${totalCount} objects visible`);
        }
    }
    
    /**
     * Apply global distance settings to all anchors
     */
    applyGlobalSettings(): void {
        for (let anchor of this.trackedAnchors) {
            if (anchor) {
                anchor.setDistanceParameters(this.globalMaxDistance, this.globalFadeDistance);
            }
        }
        print(`Applied global distance settings to ${this.trackedAnchors.length} anchors`);
    }
    
    /**
     * Refresh all anchor visibility
     */
    refreshAllVisibility(): void {
        for (let anchor of this.trackedAnchors) {
            if (anchor) {
                anchor.refreshVisibility();
            }
        }
    }
    
    /**
     * Get count of visible vs total anchored objects
     */
    getVisibilityStats(): {visible: number, total: number} {
        let visible = 0;
        let total = 0;
        
        for (let anchor of this.trackedAnchors) {
            if (anchor && anchor.getIsAnchored()) {
                total++;
                if (anchor.isVisibleByDistance()) {
                    visible++;
                }
            }
        }
        
        return {visible, total};
    }
    
    /**
     * Re-scan for new anchors (call this after creating new objects)
     */
    rescanAnchors(): void {
        this.findAllAnchors();
        print(`Rescanned: found ${this.trackedAnchors.length} anchored objects`);
    }
}