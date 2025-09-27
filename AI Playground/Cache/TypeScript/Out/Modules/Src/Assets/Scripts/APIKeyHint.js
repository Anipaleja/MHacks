"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIKeyHint = void 0;
var __selfType = requireType("./APIKeyHint");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const RemoteServiceGatewayCredentials_1 = require("Remote Service Gateway.lspkg/RemoteServiceGatewayCredentials");
let APIKeyHint = class APIKeyHint extends BaseScriptComponent {
    onAwake() {
        let apiKey = RemoteServiceGatewayCredentials_1.RemoteServiceGatewayCredentials.getApiToken(RemoteServiceGatewayCredentials_1.AvaliableApiTypes.Snap3D);
        if (apiKey === "[PUT YOUR KEY HERE]" || apiKey === "") {
            this.text.text =
                "Set your API Token in the Remote Service Gateway Credentials component to use the examples";
        }
        else {
            this.text.enabled = false;
        }
    }
};
exports.APIKeyHint = APIKeyHint;
exports.APIKeyHint = APIKeyHint = __decorate([
    component
], APIKeyHint);
//# sourceMappingURL=APIKeyHint.js.map