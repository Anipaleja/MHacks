import { LinearAlgebra } from "../Helpers/LinearAlgebra";
import { LensInitializer } from "../LensInitializer";

export class LookAtFloorBehavior {

    constructor(
        protected maxDist: number,
        protected camTr: Transform) {

    }

    private vec3up: vec3 = vec3.up();
    private floorPoint: vec3 = vec3.zero();
    private oPos: vec3;
    private oRot: quat;
    private oVel: number = 0;
    private smoothVel: number = 0;

    start() {
        this.oPos = this.getFloorPoint();
        this.oRot = quat.quatIdentity();
    }

    stop() {

    }

    getFloorPoint() {
        this.floorPoint.y = LensInitializer.getInstance().getPlayerGroundPos().y;
        return this.floorPoint;
    }

    getBehavior() {

        let pos = this.getPos();
        if (pos) {
            let rot = this.getRot(pos);
            let vel = this.smoothVel;
            return { pos, rot, vel };
        }
        else {
            let rot = undefined;
            let vel = undefined;
            return { pos, rot, vel }
        }
    }

    getPos() {
        // Get the point at which look intersects our current "floor" plane
        let pos: vec3 = LinearAlgebra.intersectLinePlane(
            this.camTr.getWorldPosition(),
            this.camTr.back,
            this.getFloorPoint(),
            this.vec3up
        );

        if (pos) {
            let camOnSurfacePos = LensInitializer.getInstance().getPlayerGroundPos();
            
            // enforce a max distance
            let dist = camOnSurfacePos.distance(pos);
            if (dist > this.maxDist) {
                let camFlatFwd = this.camTr.back;
                camFlatFwd.y = 0;
                camFlatFwd = camFlatFwd.normalize();
                pos = camOnSurfacePos.add(camFlatFwd.uniformScale(this.maxDist));
            }
        }
        return pos;
    }

    getRot(pos: vec3) {
        let dir = this.oPos.sub(pos);
        this.oPos = pos;
        let dt = getDeltaTime();
        let dist = dir.length;
        // Filter jitter
        if (dt > .0001) {
            let vel = dist / dt;
            if (vel > 20) {
                this.smoothVel = LinearAlgebra.linearlerp(this.oVel, vel, 3 * dt);
                this.oVel = this.smoothVel;
                let fwd = dir.normalize();
                let rot = quat.lookAt(fwd, this.vec3up);
                rot = quat.slerp(this.oRot, rot, 2 * dt);
                this.oRot = rot;
                return rot;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
}
