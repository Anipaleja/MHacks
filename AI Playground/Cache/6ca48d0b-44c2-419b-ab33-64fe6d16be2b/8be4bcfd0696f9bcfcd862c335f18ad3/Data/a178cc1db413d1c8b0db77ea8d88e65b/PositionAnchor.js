"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionAnchor = void 0;
var __selfType = requireType("./PositionAnchor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
/**
 * Simple world position tracker that keeps objects in fixed world locations
 */
let PositionAnchor = class PositionAnchor extends BaseScriptComponent {
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
    setAnchorPosition() {
        this.worldPosition = this.getTransform().getWorldPosition();
        this.worldRotation = this.getTransform().getWorldRotation();
        this.isAnchored = true;
        print(`Position anchored at: ${this.worldPosition.toString()}`);
    }
    /**
     * Anchors to a position in front of the camera
     */
    anchorToForwardPosition(distance = 80) {
        const forwardPos = this.wcfmp.getForwardPosition(distance);
        this.getTransform().setWorldPosition(forwardPos);
        this.setAnchorPosition();
    }
    /**
     * Anchors to a specific world position
     */
    anchorToWorldPosition(position, rotation) {
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
    removeAnchor() {
        this.isAnchored = false;
        this.worldPosition = null;
        this.worldRotation = null;
        print("Anchor removed");
    }
    /**
     * Forces the object back to its anchored position
     */
    enforceAnchor() {
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
    update() {
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
    getIsAnchored() {
        return this.isAnchored;
    }
    /**
     * Returns the anchor position
     */
    getAnchorPosition() {
        return this.worldPosition;
    }
    __initialize() {
        super.__initialize();
        this.worldPosition = null;
        this.worldRotation = null;
        this.isAnchored = false;
        this.wcfmp = WorldCameraFinderProvider_1.default.getInstance();
    }
};
exports.PositionAnchor = PositionAnchor;
exports.PositionAnchor = PositionAnchor = __decorate([
    component
], PositionAnchor);
//# sourceMappingURL=PositionAnchor.js.map