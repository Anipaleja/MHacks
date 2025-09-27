"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternetAvailabilityPopUp = void 0;
var __selfType = requireType("./InternetAvailabilityPopUp");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
let InternetAvailabilityPopUp = class InternetAvailabilityPopUp extends BaseScriptComponent {
    onAwake() {
        global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
            this.isInternetAvailable(args.isInternetAvailable);
        });
        this.isInternetAvailable(global.deviceInfoSystem.isInternetAvailable(), 0);
    }
    __initialize() {
        super.__initialize();
        this.isInternetAvailable = (bool, timeOverride = 300) => {
            if (bool) {
                LSTween_1.LSTween.scaleToLocal(this.popup.getChild(0).getTransform(), vec3.one().uniformScale(0.01), timeOverride)
                    .easing(Easing_1.default.Cubic.Out)
                    .onComplete(() => {
                    this.popup.enabled = false;
                })
                    .start();
            }
            else {
                LSTween_1.LSTween.scaleToLocal(this.popup.getChild(0).getTransform(), vec3.one(), timeOverride)
                    .easing(Easing_1.default.Cubic.In)
                    .start();
                this.popup.enabled = true;
            }
        };
    }
};
exports.InternetAvailabilityPopUp = InternetAvailabilityPopUp;
exports.InternetAvailabilityPopUp = InternetAvailabilityPopUp = __decorate([
    component
], InternetAvailabilityPopUp);
//# sourceMappingURL=InternetAvailabilityPopUp.js.map