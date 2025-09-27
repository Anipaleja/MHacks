import {RaycastInfo, RayProvider} from "./RayProvider"

import {HandInputData} from "../../Providers/HandInputData/HandInputData"
import {HandType} from "../../Providers/HandInputData/HandType"
import {interpolateVec3} from "../../Utils/mathUtils"
import {FieldTargetingMode, HandInteractor} from "../HandInteractor/HandInteractor"
import RaycastProxy from "./raycastAlgorithms/RaycastProxy"

export type HandRayProviderConfig = {
  handType: HandType
  handInteractor: HandInteractor
}

/**
 * This class provides raycasting functionality for hand interactions. It selects the appropriate raycast algorithm based on the provided configuration.
 */
export class HandRayProvider implements RayProvider {
  private handProvider: HandInputData = HandInputData.getInstance()

  private hand = this.handProvider.getHand(this.config.handType)

  readonly raycast = new RaycastProxy(this.hand)

  constructor(private config: HandRayProviderConfig) {}

  /** @inheritdoc */
  getRaycastInfo(): RaycastInfo {
    const ray = this.raycast.getRay()

    if (ray === null) {
      return {
        direction: vec3.zero(),
        locus: vec3.zero()
      }
    }

    // When not near an InteractionPlane, use the raycast base's logic for direction / locus.
    if (this.config.handInteractor.fieldTargetingMode === FieldTargetingMode.FarField) {
      return ray
    }
    // When near an InteractionPlane, raycast from the index tip straight towards the plane.
    else {
      const indexTip = this.hand.indexTip?.position

      if (indexTip === undefined) {
        return {
          direction: vec3.zero(),
          locus: vec3.zero()
        }
      }

      const locus = indexTip
      const planeProjection = this.config.handInteractor.currentInteractionPlane?.projectPoint(locus) ?? null

      if (planeProjection === null) {
        return {
          direction: vec3.zero(),
          locus: vec3.zero()
        }
      } else {
        // When transitioning to/from nearfield mode, lerp between GestureModule data and projection data.
        const lerpValue = planeProjection.lerpValue

        const startDirection = ray.direction
        const targetDirection = planeProjection.point.sub(locus).normalize()
        const lerpDirection = vec3.slerp(startDirection, targetDirection, lerpValue)

        const lerpLocus = interpolateVec3(ray.locus, locus, lerpValue)

        return {
          direction: lerpDirection,
          locus: lerpLocus
        }
      }
    }
  }

  /** @inheritdoc */
  isAvailable(): boolean {
    return (this.hand.isInTargetingPose() && this.hand.isTracked()) || this.hand.isPinching()
  }

  /** @inheritdoc */
  reset(): void {
    this.raycast.reset()
  }
}
