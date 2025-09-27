import {ObjectPool} from "./ObjectPool"
import {findComponentInChildren} from "./SceneObjectUtils"

type AABB = {
  min: vec3
  max: vec3
}

interface TransformSnapshot {
  worldPosition: vec3
  worldScale: vec3
  worldRotation: quat
  worldTransform: mat4
  inverseWorldTransform: mat4
}

interface CachedColliderData {
  aabb?: AABB
  transformSnapshot: TransformSnapshot

  fitVisual?: boolean
  size?: vec3
  radius?: number
  length?: number
}

type ShapeCalculator = (
  shape: Shape,
  queryPoint: vec3,
  cachedData: CachedColliderData,
  collider: ColliderComponent
) => vec3

const MAX_AABB_CACHE_SIZE = 500
const EPSILON = 1e-6
const EPSILON_SQUARED = EPSILON * EPSILON

/**
 * A collection of utility functions for collider calculations.
 *
 * Note: Closest point calculations are local AABB-based approximations, not precise collider geometry.
 */
export class ColliderUtils {
  private static aabbCache = new Map<ColliderComponent, CachedColliderData>()
  private static shapeCalculators = new Map<string, ShapeCalculator>()

  static {
    this.shapeCalculators.set("BoxShape", this.calculateForBox.bind(this))
    this.shapeCalculators.set("SphereShape", this.calculateForSphere.bind(this))
    this.shapeCalculators.set("CylinderShape", this.calculateForCylinder.bind(this))
    this.shapeCalculators.set("CapsuleShape", this.calculateForCapsule.bind(this))
    this.shapeCalculators.set("ConeShape", this.calculateForCone.bind(this))
  }

  /**
   * Calculates the closest point on a collider's surface to a given point in world space.
   *
   * @param collider The collider component to calculate the closest point on.
   * @param queryPoint The query point in world space.
   * @returns The closest point on the collider surface in world space.
   */
  static getClosestPointOnCollider(collider: ColliderComponent, queryPoint: vec3): vec3 {
    this.resetPools()

    const cachedData = this.getOrCreateCacheEntry(collider)
    if (!cachedData) {
      return queryPoint
    }

    const calculator = this.shapeCalculators.get(collider.shape.getTypeName())
    if (calculator) {
      return calculator(collider.shape, queryPoint, cachedData, collider)
    }

    if (cachedData.aabb) {
      return this.getClosestPointInLocalSpace(queryPoint, cachedData.aabb, cachedData)
    }

    return queryPoint
  }

  /**
   * Removes a collider's cached AABB data from the internal cache.
   */
  static invalidateCacheEntry(collider: ColliderComponent): void {
    this.aabbCache.delete(collider)
  }

  /**
   * Gets statistics about the vector object pools for debugging and monitoring.
   */
  static getPoolStats() {
    return {
      vec2Pool: this.vec2Pool.getStats(),
      vec3Pool: this.vec3Pool.getStats()
    }
  }

  private static vec2Pool = new ObjectPool({
    factory: () => new vec2(0, 0),
    onRelease: (v) => {
      v.x = 0
      v.y = 0
    },
    initialCapacity: 32,
    parentTag: "ColliderUtils"
  })

  private static vec3Pool = new ObjectPool({
    factory: () => new vec3(0, 0, 0),
    onRelease: (v) => {
      v.x = 0
      v.y = 0
      v.z = 0
    },
    initialCapacity: 32,
    parentTag: "ColliderUtils"
  })

  private static getVec2(x: number, y: number): vec2 {
    const v = this.vec2Pool.pop()
    v.x = x
    v.y = y
    return v
  }

  private static getVec3(x: number, y: number, z: number): vec3 {
    const v = this.vec3Pool.pop()
    v.x = x
    v.y = y
    v.z = z
    return v
  }

  private static resetPools(): void {
    this.vec2Pool.reset()
    this.vec3Pool.reset()
  }

  private static getOrCreateCacheEntry(collider: ColliderComponent): CachedColliderData | undefined {
    const sceneObject = collider.getSceneObject()
    if (!sceneObject) {
      return undefined
    }

    const transform = sceneObject.getTransform()
    let cachedData = this.aabbCache.get(collider)

    if (cachedData && !this.isCacheEntryValid(collider, cachedData, transform)) {
      this.aabbCache.delete(collider)
      cachedData = undefined
    }

    if (!cachedData) {
      cachedData = this.createCacheEntry(collider, transform)
    } else {
      // Mark as recently used for LRU cache policy by re-inserting it.
      this.aabbCache.delete(collider)
      this.aabbCache.set(collider, cachedData)
    }

    return cachedData
  }

  private static createCacheEntry(collider: ColliderComponent, transform: Transform): CachedColliderData {
    const shape = collider.shape
    const shapeType = shape.getTypeName()

    const transformSnapshot = this.captureTransformSnapshot(transform)
    const cachedData: CachedColliderData = {
      transformSnapshot: transformSnapshot,
      fitVisual: collider.fitVisual
    }

    switch (shapeType) {
      case "BoxShape":
        cachedData.size = (shape as BoxShape).size
        break
      case "SphereShape":
        cachedData.radius = (shape as SphereShape).radius
        break
      case "CylinderShape":
        cachedData.radius = (shape as CylinderShape).radius
        cachedData.length = (shape as CylinderShape).length
        break
      case "CapsuleShape":
        cachedData.radius = (shape as CapsuleShape).radius
        cachedData.length = (shape as CapsuleShape).length
        break
      case "ConeShape":
        cachedData.radius = (shape as ConeShape).radius
        cachedData.length = (shape as ConeShape).length
        break
    }

    const needsAABBFromVisual = collider.fitVisual || shapeType === "MeshShape"
    const hasCalculator = this.shapeCalculators.has(shapeType)
    let localAABB: AABB | undefined

    if (needsAABBFromVisual) {
      const visual = this.findRenderMeshVisualInHierarchy(collider.getSceneObject())
      if (visual) {
        localAABB = {min: visual.localAabbMin(), max: visual.localAabbMax()}
      }
    }

    if (!localAABB && (!hasCalculator || collider.fitVisual)) {
      localAABB = this.calculateLocalColliderAABB(collider)
    }

    if (localAABB) {
      cachedData.aabb = localAABB
    }

    this.addToCache(collider, cachedData)

    return cachedData
  }

  private static calculateLocalColliderAABB(collider: ColliderComponent): AABB {
    const shape = collider.shape

    // Note: Using `new vec3()` instead of pooled vectors because these vectors are stored in the cache with longer
    // lifetimes that survive pool resets.
    switch (shape.getTypeName()) {
      case "BoxShape": {
        const boxShape = shape as BoxShape
        const halfSize = boxShape.size.uniformScale(0.5)
        return {min: halfSize.uniformScale(-1), max: halfSize}
      }

      case "MeshShape": {
        const meshShape = shape as MeshShape
        if (meshShape.mesh) {
          const aabbMin = meshShape.mesh.aabbMin
          const aabbMax = meshShape.mesh.aabbMax
          return {
            min: new vec3(aabbMin.x, aabbMin.y, aabbMin.z),
            max: new vec3(aabbMax.x, aabbMax.y, aabbMax.z)
          }
        } else {
          return {min: new vec3(0, 0, 0), max: new vec3(0, 0, 0)}
        }
      }

      default:
        return {min: new vec3(0, 0, 0), max: new vec3(0, 0, 0)}
    }
  }

  private static getClosestPointInLocalSpace(
    worldQueryPoint: vec3,
    localAABB: AABB,
    cachedData: CachedColliderData
  ): vec3 {
    const transformSnapshot = cachedData.transformSnapshot
    const localQueryPoint = transformSnapshot.inverseWorldTransform.multiplyPoint(worldQueryPoint)
    const localClosestPoint = this.closestPointOnAABB(localAABB, localQueryPoint)
    return transformSnapshot.worldTransform.multiplyPoint(localClosestPoint)
  }

  private static isCacheEntryValid(
    collider: ColliderComponent,
    cachedData: CachedColliderData,
    transform: Transform
  ): boolean {
    const shape = collider.shape

    if (cachedData.fitVisual !== collider.fitVisual) {
      return false
    }

    switch (shape.getTypeName()) {
      case "BoxShape":
        if (cachedData.size && !cachedData.size.equal((shape as BoxShape).size)) {
          return false
        }
        break
      case "SphereShape":
        if (cachedData.radius !== (shape as SphereShape).radius) {
          return false
        }
        break
      case "CylinderShape": {
        const cylinder = shape as CylinderShape
        if (cachedData.radius !== cylinder.radius || cachedData.length !== cylinder.length) {
          return false
        }
        break
      }
      case "CapsuleShape": {
        const capsule = shape as CapsuleShape
        if (cachedData.radius !== capsule.radius || cachedData.length !== capsule.length) {
          return false
        }
        break
      }
      case "ConeShape": {
        const cone = shape as ConeShape
        if (cachedData.radius !== cone.radius || cachedData.length !== cone.length) {
          return false
        }
        break
      }
    }

    if (!collider || !collider.getSceneObject()) {
      return false
    }
    const currentSnapshot = this.captureTransformSnapshot(transform)
    return !this.hasTransformChanged(cachedData.transformSnapshot, currentSnapshot)
  }

  private static captureTransformSnapshot(transform: Transform): TransformSnapshot {
    const worldTransform = transform.getWorldTransform()
    return {
      worldPosition: transform.getWorldPosition(),
      worldScale: transform.getWorldScale(),
      worldRotation: transform.getWorldRotation(),
      worldTransform: worldTransform,
      inverseWorldTransform: worldTransform.inverse()
    }
  }

  private static hasTransformChanged(previous: TransformSnapshot, current: TransformSnapshot): boolean {
    if (previous.worldPosition.distanceSquared(current.worldPosition) > EPSILON_SQUARED) {
      return true
    }

    if (previous.worldScale.distanceSquared(current.worldScale) > EPSILON_SQUARED) {
      return true
    }

    const dotProduct = previous.worldRotation.dot(current.worldRotation)
    return Math.abs(dotProduct) < 1 - EPSILON
  }

  private static orientPointToYAxis(point: vec3, axis: Axis): vec3 {
    switch (axis) {
      case Axis.X:
        return this.getVec3(point.y, point.x, point.z)
      case Axis.Z:
        return this.getVec3(point.x, point.z, point.y)
      default:
        return this.getVec3(point.x, point.y, point.z)
    }
  }

  private static reorientPointFromYAxis(point: vec3, axis: Axis): vec3 {
    switch (axis) {
      case Axis.X:
        return this.getVec3(point.y, point.x, point.z)
      case Axis.Z:
        return this.getVec3(point.x, point.z, point.y)
      default:
        return this.getVec3(point.x, point.y, point.z)
    }
  }

  private static calculateClosestPointOnSphereSurface(center: vec3, radius: number, queryPoint: vec3): vec3 {
    const direction = queryPoint.sub(center)
    if (direction.lengthSquared < EPSILON_SQUARED) {
      // Query point is at the center, return an arbitrary point on the surface.
      return center.add(this.getVec3(0, radius, 0))
    }
    return center.add(direction.normalize().uniformScale(radius))
  }

  private static closestPointOnAABB(aabb: AABB, queryPoint: vec3): vec3 {
    const x = Math.max(aabb.min.x, Math.min(queryPoint.x, aabb.max.x))
    const y = Math.max(aabb.min.y, Math.min(queryPoint.y, aabb.max.y))
    const z = Math.max(aabb.min.z, Math.min(queryPoint.z, aabb.max.z))
    return this.getVec3(x, y, z)
  }

  private static findRenderMeshVisualInHierarchy(sceneObject: SceneObject): RenderMeshVisual | null {
    const visual = sceneObject.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
    if (visual) {
      return visual
    }

    return findComponentInChildren<RenderMeshVisual>(sceneObject, "Component.RenderMeshVisual")
  }

  private static addToCache(collider: ColliderComponent, dataToCache: CachedColliderData): void {
    if (this.aabbCache.size >= MAX_AABB_CACHE_SIZE) {
      const firstKey = this.aabbCache.keys().next().value
      if (firstKey) {
        this.aabbCache.delete(firstKey)
      }
    }
    this.aabbCache.set(collider, dataToCache)
  }

  private static calculateClosestPointOnCylinder(
    axis: Axis,
    radius: number,
    halfLength: number,
    queryPoint: vec3,
    cachedData: CachedColliderData
  ): vec3 {
    const localQueryPoint = cachedData.transformSnapshot.inverseWorldTransform.multiplyPoint(queryPoint)
    const orientedPoint = this.orientPointToYAxis(localQueryPoint, axis)

    const clampedY = Math.max(-halfLength, Math.min(orientedPoint.y, halfLength))
    const radialDistSq = orientedPoint.x * orientedPoint.x + orientedPoint.z * orientedPoint.z

    let radialX = orientedPoint.x
    let radialZ = orientedPoint.z

    const isBeyondEnds = orientedPoint.y > halfLength || orientedPoint.y < -halfLength

    if (!isBeyondEnds || radialDistSq > radius * radius) {
      if (radialDistSq > EPSILON_SQUARED) {
        const scale = radius / Math.sqrt(radialDistSq)
        radialX *= scale
        radialZ *= scale
      } else {
        radialX = radius
        radialZ = 0
      }
    }

    const orientedClosest = this.getVec3(radialX, clampedY, radialZ)
    const finalLocalClosest = this.reorientPointFromYAxis(orientedClosest, axis)
    return cachedData.transformSnapshot.worldTransform.multiplyPoint(finalLocalClosest)
  }

  private static calculateClosestPointOnCapsule(
    axis: Axis,
    radius: number,
    halfLength: number,
    queryPoint: vec3,
    cachedData: CachedColliderData
  ): vec3 {
    const localQueryPoint = cachedData.transformSnapshot.inverseWorldTransform.multiplyPoint(queryPoint)
    const orientedPoint = this.orientPointToYAxis(localQueryPoint, axis)

    let orientedClosest: vec3

    if (orientedPoint.y < -halfLength) {
      const hemisphereCenter = this.getVec3(0, -halfLength, 0)
      orientedClosest = this.calculateClosestPointOnSphereSurface(hemisphereCenter, radius, orientedPoint)
    } else if (orientedPoint.y > halfLength) {
      const hemisphereCenter = this.getVec3(0, halfLength, 0)
      orientedClosest = this.calculateClosestPointOnSphereSurface(hemisphereCenter, radius, orientedPoint)
    } else {
      let radialVec = this.getVec3(orientedPoint.x, 0, orientedPoint.z)
      if (radialVec.lengthSquared > EPSILON_SQUARED) {
        radialVec = radialVec.normalize().uniformScale(radius)
      } else {
        radialVec.x = radius
      }
      orientedClosest = this.getVec3(radialVec.x, orientedPoint.y, radialVec.z)
    }

    const finalLocalClosest = this.reorientPointFromYAxis(orientedClosest, axis)
    return cachedData.transformSnapshot.worldTransform.multiplyPoint(finalLocalClosest)
  }

  private static calculateClosestPointOnCone(
    axis: Axis,
    radius: number,
    length: number,
    queryPoint: vec3,
    cachedData: CachedColliderData
  ): vec3 {
    const localQueryPoint = cachedData.transformSnapshot.inverseWorldTransform.multiplyPoint(queryPoint)
    const orientedPoint = this.orientPointToYAxis(localQueryPoint, axis)
    const halfLength = length * 0.5

    const radialDist = Math.sqrt(orientedPoint.x * orientedPoint.x + orientedPoint.z * orientedPoint.z)
    const queryPoint2D = this.getVec2(radialDist, orientedPoint.y)
    const segA = this.getVec2(radius, -halfLength)
    const segB = this.getVec2(0, halfLength)
    const segVec = segB.sub(segA)
    let t = 0
    if (segVec.lengthSquared > EPSILON_SQUARED) {
      t = queryPoint2D.sub(segA).dot(segVec) / segVec.lengthSquared
    }
    const clampedT = Math.max(0, Math.min(1, t))
    const closestPointOnHull2D = segA.add(segVec.uniformScale(clampedT))

    let closestPointOnHull3D: vec3

    if (radialDist > EPSILON) {
      const scale = closestPointOnHull2D.x / radialDist
      closestPointOnHull3D = this.getVec3(orientedPoint.x * scale, closestPointOnHull2D.y, orientedPoint.z * scale)
    } else {
      closestPointOnHull3D = this.getVec3(closestPointOnHull2D.x, closestPointOnHull2D.y, 0)
    }

    if (orientedPoint.y < -halfLength) {
      const pointOnBaseDisk = this.getVec3(orientedPoint.x, -halfLength, orientedPoint.z)
      const baseDiskRadiusSq = pointOnBaseDisk.x * pointOnBaseDisk.x + pointOnBaseDisk.z * pointOnBaseDisk.z
      if (baseDiskRadiusSq > radius * radius) {
        const baseScale = radius / Math.sqrt(baseDiskRadiusSq)
        pointOnBaseDisk.x *= baseScale
        pointOnBaseDisk.z *= baseScale
      }

      if (orientedPoint.distanceSquared(pointOnBaseDisk) < orientedPoint.distanceSquared(closestPointOnHull3D)) {
        closestPointOnHull3D = pointOnBaseDisk
      }
    }

    const finalLocalClosest = this.reorientPointFromYAxis(closestPointOnHull3D, axis)
    return cachedData.transformSnapshot.worldTransform.multiplyPoint(finalLocalClosest)
  }

  private static calculateForBox(
    shape: Shape,
    queryPoint: vec3,
    cachedData: CachedColliderData,
    collider: ColliderComponent
  ): vec3 {
    let localAABB: AABB

    if (collider.fitVisual && cachedData.aabb) {
      localAABB = cachedData.aabb
    } else {
      const boxShape = shape as BoxShape
      const halfSize = boxShape.size.uniformScale(0.5)
      localAABB = {min: halfSize.uniformScale(-1), max: halfSize}
    }

    const localQueryPoint = cachedData.transformSnapshot.inverseWorldTransform.multiplyPoint(queryPoint)
    const localClosestPoint = this.closestPointOnAABB(localAABB, localQueryPoint)

    return cachedData.transformSnapshot.worldTransform.multiplyPoint(localClosestPoint)
  }

  private static calculateForSphere(
    shape: Shape,
    queryPoint: vec3,
    cachedData: CachedColliderData,
    collider: ColliderComponent
  ): vec3 {
    const sphereShape = shape as SphereShape
    if (collider.fitVisual && cachedData.aabb) {
      const aabbSize = cachedData.aabb.max.sub(cachedData.aabb.min)
      const derivedRadius = Math.max(aabbSize.x, aabbSize.y, aabbSize.z) / 2.0
      const center = cachedData.aabb.min.add(cachedData.aabb.max).uniformScale(0.5)

      const worldCenter = cachedData.transformSnapshot.worldTransform.multiplyPoint(center)
      const scaledRadius =
        derivedRadius *
        Math.max(
          cachedData.transformSnapshot.worldScale.x,
          cachedData.transformSnapshot.worldScale.y,
          cachedData.transformSnapshot.worldScale.z
        )

      return this.calculateClosestPointOnSphereSurface(worldCenter, scaledRadius, queryPoint)
    } else {
      const scaledRadius =
        sphereShape.radius *
        Math.max(
          cachedData.transformSnapshot.worldScale.x,
          cachedData.transformSnapshot.worldScale.y,
          cachedData.transformSnapshot.worldScale.z
        )
      return this.calculateClosestPointOnSphereSurface(
        cachedData.transformSnapshot.worldPosition,
        scaledRadius,
        queryPoint
      )
    }
  }

  private static calculateForCylinder(
    shape: Shape,
    queryPoint: vec3,
    cachedData: CachedColliderData,
    _collider: ColliderComponent
  ): vec3 {
    const cylinderShape = shape as CylinderShape
    return this.calculateClosestPointOnCylinder(
      cylinderShape.axis,
      cylinderShape.radius,
      cylinderShape.length * 0.5,
      queryPoint,
      cachedData
    )
  }

  private static calculateForCapsule(
    shape: Shape,
    queryPoint: vec3,
    cachedData: CachedColliderData,
    _collider: ColliderComponent
  ): vec3 {
    const capsuleShape = shape as CapsuleShape
    return this.calculateClosestPointOnCapsule(
      capsuleShape.axis,
      capsuleShape.radius,
      capsuleShape.length * 0.5,
      queryPoint,
      cachedData
    )
  }

  private static calculateForCone(
    shape: Shape,
    queryPoint: vec3,
    cachedData: CachedColliderData,
    _collider: ColliderComponent
  ): vec3 {
    const coneShape = shape as ConeShape
    return this.calculateClosestPointOnCone(coneShape.axis, coneShape.radius, coneShape.length, queryPoint, cachedData)
  }
}
