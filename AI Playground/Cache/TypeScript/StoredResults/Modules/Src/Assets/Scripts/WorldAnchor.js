"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldAnchor = void 0;
var __selfType = requireType("./WorldAnchor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
/**
 * Component that anchors objects to specific world positions with distance-based visibility
 */
let WorldAnchor = class WorldAnchor extends BaseScriptComponent {
    onAwake() {
        if (this.autoAnchorOnAwake) {
            if (this.useCurrentPosition) {
                this.anchorToCurrentPosition();
            }
            else {
                this.anchorToForwardPosition();
            }
        }
    }
    /**
     * Anchors the object to its current world position
     */
    anchorToCurrentPosition() {
        this.anchorPosition = this.getTransform().getWorldPosition();
        this.anchorRotation = this.getTransform().getWorldRotation();
        this.isAnchored = true;
        this.applyAnchorPosition();
        print(`Object anchored to current position: ${this.anchorPosition.toString()}`);
    }
    /**
     * Anchors the object to a position in front of the camera
     */
    anchorToForwardPosition() {
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
    anchorToPosition(position, rotation) {
        this.anchorPosition = position;
        this.anchorRotation = rotation || this.getTransform().getWorldRotation();
        this.isAnchored = true;
        this.applyAnchorPosition();
        print(`Object anchored to specified position: ${this.anchorPosition.toString()}`);
    }
    /**
     * Removes the anchor, allowing the object to move freely
     */
    removeAnchor() {
        this.isAnchored = false;
        this.anchorPosition = null;
        this.anchorRotation = null;
        print("Object anchor removed");
    }
    /**
     * Applies the anchor position to the object
     */
    applyAnchorPosition() {
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
    getIsAnchored() {
        return this.isAnchored;
    }
    /**
     * Returns the current anchor position (if anchored)
     */
    getAnchorPosition() {
        return this.anchorPosition;
    }
    /**
     * Returns the current anchor rotation (if anchored)
     */
    getAnchorRotation() {
        return this.anchorRotation;
    }
    /**
     * Updates the anchor distance and re-anchors if currently anchored
     */
    setAnchorDistance(distance) {
        this.anchorDistance = distance;
        if (this.isAnchored && !this.useCurrentPosition) {
            this.anchorToForwardPosition();
        }
    }
    __initialize() {
        super.__initialize();
        this.wcfmp = WorldCameraFinderProvider_1.default.getInstance();
        this.isAnchored = false;
        this.anchorPosition = null;
        this.anchorRotation = null;
        this.originalOpacity = 1.0;
    }
};
exports.WorldAnchor = WorldAnchor;
exports.WorldAnchor = WorldAnchor = __decorate([
    component
], WorldAnchor);
//# sourceMappingURL=WorldAnchor.js.map