"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractableImageGenerator = void 0;
var __selfType = requireType("./InteractableSnap3DGenerator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let InteractableImageGenerator = class InteractableImageGenerator extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            this.asrQueryController.onQueryEvent.add((query) => {
                this.snap3DFactory.createInteractable3DObject(query, this.targetPosition.getTransform().getWorldPosition());
            });
        });
    }
};
exports.InteractableImageGenerator = InteractableImageGenerator;
exports.InteractableImageGenerator = InteractableImageGenerator = __decorate([
    component
], InteractableImageGenerator);
//# sourceMappingURL=InteractableSnap3DGenerator.js.map