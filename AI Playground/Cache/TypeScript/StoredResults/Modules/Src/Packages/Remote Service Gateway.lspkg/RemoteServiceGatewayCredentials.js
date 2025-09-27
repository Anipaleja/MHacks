"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RemoteServiceGatewayCredentials_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteServiceGatewayCredentials = exports.AvaliableApiTypes = void 0;
var __selfType = requireType("./RemoteServiceGatewayCredentials");
function component(target) { target.getTypeName = function () { return __selfType; }; }
var AvaliableApiTypes;
(function (AvaliableApiTypes) {
    AvaliableApiTypes["Snap3D"] = "Snap3D";
    AvaliableApiTypes["OpenAI"] = "OpenAI";
    AvaliableApiTypes["Gemini"] = "Gemini";
    AvaliableApiTypes["DeepSeek"] = "DeepSeek";
})(AvaliableApiTypes || (exports.AvaliableApiTypes = AvaliableApiTypes = {}));
let RemoteServiceGatewayCredentials = RemoteServiceGatewayCredentials_1 = class RemoteServiceGatewayCredentials extends BaseScriptComponent {
    onAwake() {
        RemoteServiceGatewayCredentials_1.token = this.apiToken;
    }
    static getApiToken(avaliableType) {
        return RemoteServiceGatewayCredentials_1.token;
    }
};
exports.RemoteServiceGatewayCredentials = RemoteServiceGatewayCredentials;
RemoteServiceGatewayCredentials.token = "";
exports.RemoteServiceGatewayCredentials = RemoteServiceGatewayCredentials = RemoteServiceGatewayCredentials_1 = __decorate([
    component
], RemoteServiceGatewayCredentials);
//# sourceMappingURL=RemoteServiceGatewayCredentials.js.map