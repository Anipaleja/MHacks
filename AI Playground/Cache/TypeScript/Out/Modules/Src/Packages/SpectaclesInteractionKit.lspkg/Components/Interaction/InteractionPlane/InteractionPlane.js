"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionPlane = void 0;
var __selfType = requireType("./InteractionPlane");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const animate_1 = require("../../../Utils/animate");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const DEFAULT_LERP_OFFSET_CM = 25;
const DEFAULT_INTERACTION_ZONE_DISTANCE_CM = 20;
const DEFAULT_DIRECT_ZONE_DISTANCE_CM = 7.5;
const DEFAULT_BEHIND_ZONE_DISTANCE_CM = 15;
const TAG = "InteractionPlane";
/**
 * An InteractionPlane defines a zone which triggers near field targeting logic for HandInteractors.
 * An InteractionPlane should be added to any 2D UIs with high button density, such as ContainerFrame menus.
 * Only one InteractionPlane should be added per UI (ContainerFrame adds an InteractionPlane by default).
 */
let InteractionPlane = class InteractionPlane extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnDestroyEvent").bind(() => this.release());
        this.createEvent("OnEnableEvent").bind(() => {
            InteractionManager_1.InteractionManager.getInstance().registerInteractionPlane(this);
        });
        this.createEvent("OnDisableEvent").bind(() => {
            InteractionManager_1.InteractionManager.getInstance().deregisterInteractionPlane(this);
        });
        this.createEvent("OnStartEvent").bind(() => {
            this._collider = this.sceneObject.createComponent("ColliderComponent");
            this.buildMeshShape();
            this._collider.debugDrawEnabled = this.drawDebug;
            InteractionManager_1.InteractionManager.getInstance().registerInteractionPlane(this);
        });
    }
    release() {
        InteractionManager_1.InteractionManager.getInstance().deregisterInteractionPlane(this);
    }
    // Manually create the mesh shape for the interaction zone to trigger NearField targeting.
    buildMeshShape() {
        if (this.collider === null) {
            return;
        }
        if (this.proximityDistance <= 0 || this.behindDistance <= 0 || this.planeSize.x <= 0 || this.planeSize.y <= 0) {
            this.log.f(`InteractionPlane must have proximityDistance, behindDistance, or planeSize set to positive values.`);
        }
        const shape = Shape.createBoxShape();
        shape.size = new vec3(this.planeSize.x + this.lerpOffset, this.planeSize.y + this.lerpOffset, (this.proximityDistance + this.lerpOffset) * 2);
        this.collider.shape = shape;
    }
    /**
     * Sets the size (in world units) of the plane's interaction zone along the local X and Y axes of the SceneObject.
     */
    set planeSize(size) {
        this._planeSize = size;
        this.buildMeshShape();
    }
    /**
     * @returns the size (in world units) of the plane's interaction zone along the local X and Y axes of the SceneObject.
     */
    get planeSize() {
        return this._planeSize;
    }
    /**
     * Sets the depth (in world units) of the plane's interaction zone along the local Z axis of the SceneObject.
     */
    set proximityDistance(distance) {
        this._proximityDistance = distance;
        this.buildMeshShape();
    }
    /**
     * Returns the depth (in world units) of the plane's interaction zone along the local Z axis of the SceneObject.
     */
    get proximityDistance() {
        return this._proximityDistance;
    }
    /**
     * Sets the depth (in world units) of the plane's direct interaction zone along the local Z axis of the SceneObject.
     */
    set directZoneDistance(distance) {
        this._directZoneDistance = distance;
    }
    /**
     * Returns the depth (in world units) of the plane's direct interaction zone along the local Z axis of the SceneObject.
     */
    get directZoneDistance() {
        return this._directZoneDistance;
    }
    /**
     * Sets the depth (in world units) of the plane's behind zone along the local Z axis of the SceneObject.
     */
    set behindDistance(distance) {
        this._behindDistance = distance;
        this.buildMeshShape();
    }
    /**
     * Returns the depth (in world units) of the plane's behind zone along the local Z axis of the SceneObject.
     */
    get behindDistance() {
        return this._behindDistance;
    }
    /**
     * Sets the depth (in world units) of the plane's lerp zone.
     */
    set lerpOffset(distance) {
        this._lerpOffset = distance;
        this.buildMeshShape();
    }
    /**
     * Returns the depth (in world units) of the plane's lerp zone.
     */
    get lerpOffset() {
        return this._lerpOffset;
    }
    /**
     * Sets if the interaction zone should be drawn via debug gizmos.
     */
    set drawDebug(enabled) {
        this._drawDebug = enabled;
        if (this.collider !== null) {
            this.collider.debugDrawEnabled = enabled;
        }
    }
    /**
     * @returns if the interaction zone should be drawn via debug gizmos.
     */
    get drawDebug() {
        return this._drawDebug;
    }
    /**
     * @returns a vec3 representing the normal vector of the plane.
     */
    get normal() {
        return this.getTransform().forward;
    }
    /**
     * Returns the collider of the InteractionPlane after initialization during OnStartEvent.
     * Returns null otherwise.
     */
    get collider() {
        return this._collider;
    }
    /**
     * Project a 3D point in world space onto the InteractionPlane.
     * @param point - a 3D point in world space
     * @returns - a ZoneProjection representing the point's projection onto the plane, the distance of the point from the plane (negative if behind the plane),
     *            a boolean checking if the point resides within the interaction zone of the plane (defined by size and proximityDistance),
     *            and a boolean checking if the point resides within the behind zone of the plane (right behind the plane),
     *            or null if the point does not project onto the plane.
     */
    projectPoint(point) {
        if (!this.enabled || !this.sceneObject.isEnabledInHierarchy) {
            return null;
        }
        // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
        // l0 represents point, l represents direction, p0 represents plane origin, and n represents the plane normal.
        const po = this.sceneObject.getTransform().getWorldPosition();
        const n = this.sceneObject.getTransform().forward;
        const v = po.sub(point);
        const l = n.uniformScale(-1);
        const t = v.dot(n) / l.dot(n);
        // Project the point onto the plane.
        const projectedPoint = point.add(l.uniformScale(t));
        const r = this.sceneObject.getTransform().right;
        const u = this.sceneObject.getTransform().up;
        // Get the local X and Y coordinates within the plane space to check if the point resides within the interaction zone.
        const d = projectedPoint.sub(po);
        const x = d.dot(r);
        const y = d.dot(u);
        // Get the distance of the original point from the plane.
        const distance = point.sub(projectedPoint).length * Math.sign(t);
        // Check if the point is in front of the plane, within the proximity distance threshold, and within the planeSize boundaries.
        const isWithinInteractionZone = distance >= 0 &&
            distance <= this.proximityDistance + this.lerpOffset &&
            Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
            Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset;
        // Check if the point is within the direct interaction distance threshold.
        const isWithinDirectZone = this.enableDirectZone &&
            distance >= 0 &&
            distance <= this.directZoneDistance &&
            Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
            Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset;
        // Check if the point is in behind the plane, within the behind zone distance threshold, and within the planeSize boundaries.
        const isWithinBehindZone = distance < 0 &&
            distance >= -this.behindDistance &&
            Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
            Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset;
        const distanceToHorizontalEdge = Math.abs(x) - this.planeSize.x / 2;
        const horizontalLerpValue = distanceToHorizontalEdge > 0 ? 1 - Math.min(distanceToHorizontalEdge, this.lerpOffset) / this.lerpOffset : 1;
        const distanceToVerticalEdge = Math.abs(y) - this.planeSize.y / 2;
        const verticalLerpValue = distanceToVerticalEdge > 0 ? 1 - Math.min(distanceToVerticalEdge, this.lerpOffset) / this.lerpOffset : 1;
        const distanceToProximityEdge = distance - this.proximityDistance;
        const proximityLerpValue = distanceToProximityEdge > 0 ? 1 - Math.min(distanceToProximityEdge, this.lerpOffset) / this.lerpOffset : 1;
        const lerpValue = animate_1.easingFunctions["ease-in-out-sine"](Math.min(horizontalLerpValue, verticalLerpValue, proximityLerpValue));
        // If the point is within the interaction zone, return the plane projection data. Otherwise, return null.
        const planeProjection = {
            point: projectedPoint,
            distance: distance,
            isWithinInteractionZone: isWithinInteractionZone,
            isWithinBehindZone: isWithinBehindZone,
            isWithinDirectZone: isWithinDirectZone,
            lerpValue: lerpValue
        };
        return planeProjection;
    }
    __initialize() {
        super.__initialize();
        this.
        /**
         * Whether the direct zone of the interaction plane is enabled.
         */
        enableDirectZone = true;
        this._collider = null;
        this.log = new NativeLogger_1.default(TAG);
    }
};
exports.InteractionPlane = InteractionPlane;
exports.InteractionPlane = InteractionPlane = __decorate([
    component
], InteractionPlane);
//# sourceMappingURL=InteractionPlane.js.map