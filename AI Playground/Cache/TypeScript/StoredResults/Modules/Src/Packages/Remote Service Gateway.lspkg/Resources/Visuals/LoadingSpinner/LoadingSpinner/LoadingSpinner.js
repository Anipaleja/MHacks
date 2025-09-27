"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSpinner = void 0;
var __selfType = requireType("./LoadingSpinner");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const __material = requireAsset("./LoadingSpinner.mat");
const __mesh = requireAsset("./LoadingSpinner.mesh");
const SPIN_SPEED = 5;
const FADE_IN_TIME = 0.3;
const FADE_OUT_TIME = 0.2;
const ARC_SPREAD_TIME = 0.8;
/**
 * LoadingSpinner is the standard indeterminate progress bar used everywhere.
 * To use it, add this component to an empty SceneObject. It will create the
 * RenderMeshVisual automatically. In local space, the bounding box of the mesh
 * goes from -0.5 to 0.5 and faces the Z-axis. It can be resized by setting a
 * scale on the Transform or by adding a ScreenTransform to the SceneObject.
 */
let LoadingSpinner = class LoadingSpinner extends BaseScriptComponent {
    onAwake() {
        var _a, _b;
        var _c, _d;
        this.createEvent("OnStartEvent").bind(() => this.onEnable());
        this.createEvent("OnEnableEvent").bind(() => this.onEnable());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
        // build visual
        (_a = (_c = this.meshVisual).mesh) !== null && _a !== void 0 ? _a : (_c.mesh = __mesh);
        (_b = (_d = this.meshVisual).mainMaterial) !== null && _b !== void 0 ? _b : (_d.mainMaterial = __material);
        this.meshVisual.setRenderOrder(this.renderOrder);
        // prevent first-frame glitch
        this.meshVisual.enabled = false;
        // initial state
        const pass = this.meshVisual.mainPassOverrides;
        pass["opacity"] = this.meshVisual.mainPass["opacity"];
        pass["arcCenter"] = this.meshVisual.mainPass["arcCenter"];
        pass["arcSpread"] = this.meshVisual.mainPass["arcSpread"];
        this.arcSpread = pass["arcSpread"];
    }
    onEnable() {
        // restart fade in tween
        this.reveal = true;
        const pass = this.meshVisual.mainPassOverrides;
        pass["opacity"] = 0;
        pass["arcCenter"] = vec2.zero();
        pass["arcSpread"] = 0;
    }
    onUpdate() {
        // don't skip over too much of the fade in during jank
        const dt = Math.min(getDeltaTime(), 1 / 30);
        const pass = this.meshVisual.mainPassOverrides;
        // animate spinning
        let arcCenter = pass["arcCenter"];
        arcCenter.x += SPIN_SPEED * -dt;
        arcCenter.y += SPIN_SPEED * dt;
        pass["arcCenter"] = arcCenter;
        // tween arc spread on reveal
        pass["arcSpread"] = this.moveTowards(pass["arcSpread"], this.reveal ? this.arcSpread : 0, (this.arcSpread / (this.reveal ? ARC_SPREAD_TIME : FADE_OUT_TIME * 3)) *
            dt);
        // tween alpha on reveal and conceal
        const opacity = (pass["opacity"] = this.moveTowards(pass["opacity"], this.reveal ? 1 : 0, (1 / (this.reveal ? FADE_IN_TIME : FADE_OUT_TIME)) * dt));
        // disable mesh when alpha is 0
        this.meshVisual.enabled = opacity > 0;
    }
    moveTowards(current, target, dist) {
        // apply a delta to a value, but don't overshoot the target
        const delta = target - current;
        if (dist >= Math.abs(delta)) {
            return target;
        }
        else {
            const travel = dist * Math.sign(delta);
            return current + travel;
        }
    }
    __initialize() {
        var _a;
        super.__initialize();
        this.meshVisual = (_a = this.sceneObject.getComponent("RenderMeshVisual")) !== null && _a !== void 0 ? _a : this.sceneObject.createComponent("RenderMeshVisual");
        this.arcSpread = 0;
        this.reveal = false;
    }
};
exports.LoadingSpinner = LoadingSpinner;
exports.LoadingSpinner = LoadingSpinner = __decorate([
    component
], LoadingSpinner);
//# sourceMappingURL=LoadingSpinner.js.map