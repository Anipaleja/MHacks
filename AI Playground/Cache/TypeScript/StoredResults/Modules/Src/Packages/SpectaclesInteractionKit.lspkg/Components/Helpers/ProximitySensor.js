"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProximitySensor = void 0;
var __selfType = requireType("./ProximitySensor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Creates a spherical sensor volume to track overlaps with other colliders.
 *
 * This component actively maintains a list of objects within its radius and can be queried to find the closest point on
 * those objects.
 */
let ProximitySensor = class ProximitySensor extends BaseScriptComponent {
    onAwake() {
        this.createSensorVolume();
    }
    /**
     * Updates the radius at runtime and automatically recalculates the larger detection radius needed for the buffer.
     * @param newRadius The new inner radius for the effect.
     */
    setRadius(newRadius) {
        this.radius = newRadius;
        if (this.sensorCollider && this.sensorCollider.shape) {
            const sphereShape = this.sensorCollider.shape;
            sphereShape.radius = this.radius;
        }
    }
    /**
     * Returns a list of all colliders currently inside the large detection volume.
     * @returns An array of the overlapping ColliderComponents.
     */
    getOverlappingColliders() {
        if (this.debugModeEnabled) {
            const sensorCenter = this.getSceneObject().getTransform().getWorldPosition();
            global.debugRenderSystem.drawSphere(sensorCenter, this.radius, new vec4(0.7, 0.7, 0.7, 1));
        }
        return Array.from(this.overlappingColliders);
    }
    createSensorVolume() {
        this.sensorCollider = this.getSceneObject().createComponent("Physics.ColliderComponent");
        const shape = Shape.createSphereShape();
        shape.radius = this.radius;
        this.sensorCollider.shape = shape;
        this.sensorCollider.intangible = true;
        this.sensorCollider.debugDrawEnabled = false;
        this.sensorCollider.onOverlapEnter.add(this.onOverlapEnter.bind(this));
        this.sensorCollider.onOverlapExit.add(this.onOverlapExit.bind(this));
    }
    onOverlapEnter(args) {
        const otherCollider = args.overlap.collider;
        if (otherCollider && otherCollider !== this.sensorCollider) {
            this.overlappingColliders.add(otherCollider);
        }
    }
    onOverlapExit(args) {
        const otherCollider = args.overlap.collider;
        if (otherCollider) {
            this.overlappingColliders.delete(otherCollider);
        }
    }
    __initialize() {
        super.__initialize();
        this.sensorCollider = null;
        this.overlappingColliders = new Set();
    }
};
exports.ProximitySensor = ProximitySensor;
exports.ProximitySensor = ProximitySensor = __decorate([
    component
], ProximitySensor);
//# sourceMappingURL=ProximitySensor.js.map