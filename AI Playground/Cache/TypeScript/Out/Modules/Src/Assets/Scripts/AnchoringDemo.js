"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchoringDemo = void 0;
var __selfType = requireType("./AnchoringDemo");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const PositionAnchor_1 = require("./PositionAnchor");
/**
 * Demo script showing world anchoring with distance-based visibility
 */
let AnchoringDemo = class AnchoringDemo extends BaseScriptComponent {
    onAwake() {
        if (!this.enableDemo)
            return;
        // Parse the test prompts
        this.promptList = this.testPrompts.split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);
        // Set up touch controls
        this.createEvent("TapEvent").bind(() => {
            this.createNextObject();
        });
        // Auto generate if enabled
        if (this.autoGenerate && this.promptList.length > 0) {
            let lastCreateTime = 0;
            this.createEvent("UpdateEvent").bind(() => {
                const currentTime = getTime();
                if (currentTime - lastCreateTime > 3.0) {
                    this.createNextObject();
                    lastCreateTime = currentTime;
                }
            });
        }
        print("Anchoring Demo initialized! Tap to create anchored objects.");
        print("Objects will stay in place and fade based on distance.");
        // Set up distance feedback if enabled
        if (this.showDistanceFeedback) {
            this.setupDistanceFeedback();
        }
    }
    setupDistanceFeedback() {
        let lastFeedbackTime = 0;
        this.createEvent("UpdateEvent").bind(() => {
            const currentTime = getTime();
            if (currentTime - lastFeedbackTime > 2.0) { // Every 2 seconds
                if (this.distanceManager) {
                    const stats = this.distanceManager.getVisibilityStats();
                    if (stats.total > 0) {
                        print(`Visibility: ${stats.visible}/${stats.total} objects in range`);
                    }
                }
                lastFeedbackTime = currentTime;
            }
        });
    }
    createNextObject() {
        if (!this.enhancedFactory || this.promptList.length === 0) {
            print("No factory or prompts available");
            return;
        }
        const prompt = this.promptList[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.promptList.length;
        print(`Creating anchored object: ${prompt}`);
        this.enhancedFactory.generateAnchoredObject(prompt)
            .then((result) => {
            print(result);
            // Rescan for new anchors if distance manager is available
            if (this.distanceManager) {
                this.distanceManager.rescanAnchors();
            }
        })
            .catch((error) => {
            print("Error creating object: " + error);
        });
    }
    /**
     * Method to manually anchor existing objects
     */
    anchorAllObjectsInScene() {
        const allObjects = this.sceneObject.getParent();
        this.anchorChildObjects(allObjects);
    }
    anchorChildObjects(parent) {
        for (let i = 0; i < parent.getChildrenCount(); i++) {
            const child = parent.getChild(i);
            // Check if this object doesn't already have a PositionAnchor
            if (!child.getComponent(PositionAnchor_1.PositionAnchor.getTypeName())) {
                // Add anchoring to objects that look like generated content
                if (child.name.includes("Snap3D") || child.name.includes("Generated")) {
                    const anchor = child.createComponent(PositionAnchor_1.PositionAnchor.getTypeName());
                    anchor.anchorOnStart = true;
                    print(`Added anchor to existing object: ${child.name}`);
                }
            }
            // Recursively check children
            if (child.getChildrenCount() > 0) {
                this.anchorChildObjects(child);
            }
        }
    }
    __initialize() {
        super.__initialize();
        this.promptList = [];
        this.currentIndex = 0;
    }
};
exports.AnchoringDemo = AnchoringDemo;
exports.AnchoringDemo = AnchoringDemo = __decorate([
    component
], AnchoringDemo);
//# sourceMappingURL=AnchoringDemo.js.map