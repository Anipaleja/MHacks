"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandRayProvider = void 0;
const HandInputData_1 = require("../../Providers/HandInputData/HandInputData");
const mathUtils_1 = require("../../Utils/mathUtils");
const HandInteractor_1 = require("../HandInteractor/HandInteractor");
const RaycastProxy_1 = require("./raycastAlgorithms/RaycastProxy");
/**
 * This class provides raycasting functionality for hand interactions. It selects the appropriate raycast algorithm based on the provided configuration.
 */
class HandRayProvider {
    constructor(config) {
        this.config = config;
        this.handProvider = HandInputData_1.HandInputData.getInstance();
        this.hand = this.handProvider.getHand(this.config.handType);
        this.raycast = new RaycastProxy_1.default(this.hand);
    }
    /** @inheritdoc */
    getRaycastInfo() {
        var _a, _b, _c;
        const ray = this.raycast.getRay();
        if (ray === null) {
            return {
                direction: vec3.zero(),
                locus: vec3.zero()
            };
        }
        // When not near an InteractionPlane, use the raycast base's logic for direction / locus.
        if (this.config.handInteractor.fieldTargetingMode === HandInteractor_1.FieldTargetingMode.FarField) {
            return ray;
        }
        // When near an InteractionPlane, raycast from the index tip straight towards the plane.
        else {
            const indexTip = (_a = this.hand.indexTip) === null || _a === void 0 ? void 0 : _a.position;
            if (indexTip === undefined) {
                return {
                    direction: vec3.zero(),
                    locus: vec3.zero()
                };
            }
            const locus = indexTip;
            const planeProjection = (_c = (_b = this.config.handInteractor.currentInteractionPlane) === null || _b === void 0 ? void 0 : _b.projectPoint(locus)) !== null && _c !== void 0 ? _c : null;
            if (planeProjection === null) {
                return {
                    direction: vec3.zero(),
                    locus: vec3.zero()
                };
            }
            else {
                // When transitioning to/from nearfield mode, lerp between GestureModule data and projection data.
                const lerpValue = planeProjection.lerpValue;
                const startDirection = ray.direction;
                const targetDirection = planeProjection.point.sub(locus).normalize();
                const lerpDirection = vec3.slerp(startDirection, targetDirection, lerpValue);
                const lerpLocus = (0, mathUtils_1.interpolateVec3)(ray.locus, locus, lerpValue);
                return {
                    direction: lerpDirection,
                    locus: lerpLocus
                };
            }
        }
    }
    /** @inheritdoc */
    isAvailable() {
        return (this.hand.isInTargetingPose() && this.hand.isTracked()) || this.hand.isPinching();
    }
    /** @inheritdoc */
    reset() {
        this.raycast.reset();
    }
}
exports.HandRayProvider = HandRayProvider;
//# sourceMappingURL=HandRayProvider.js.map