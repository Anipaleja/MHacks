"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASRQueryController = void 0;
var __selfType = requireType("./ASRQueryController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const LSTween_1 = require("LSTween.lspkg/LSTween");
let ASRQueryController = class ASRQueryController extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.init.bind(this));
    }
    init() {
        this.activityMaterial = this.activityRenderMesh.mainMaterial.clone();
        this.activityRenderMesh.clearMaterials();
        this.activityRenderMesh.mainMaterial = this.activityMaterial;
        this.activityMaterial.mainPass.in_out = 0;
        this.button.onButtonPinched.add(() => {
            this.getVoiceQuery().then((query) => {
                this.onQueryEvent.invoke(query);
            });
        });
    }
    getVoiceQuery() {
        return new Promise((resolve, reject) => {
            if (this.isRecording) {
                this.animateVoiceIndicator(false);
                this.asrModule.stopTranscribing();
                this.isRecording = false;
                reject("Already recording, cancel recording");
                return;
            }
            this.isRecording = true;
            let asrSettings = AsrModule.AsrTranscriptionOptions.create();
            asrSettings.mode = AsrModule.AsrMode.HighAccuracy;
            asrSettings.silenceUntilTerminationMs = 1500;
            asrSettings.onTranscriptionUpdateEvent.add((asrOutput) => {
                if (asrOutput.isFinal) {
                    this.isRecording = false;
                    this.animateVoiceIndicator(false);
                    this.asrModule.stopTranscribing();
                    resolve(asrOutput.text);
                }
            });
            asrSettings.onTranscriptionErrorEvent.add((asrOutput) => {
                this.isRecording = false;
                this.animateVoiceIndicator(false);
                reject(asrOutput);
            });
            this.animateVoiceIndicator(true);
            this.asrModule.startTranscribing(asrSettings);
        });
    }
    animateVoiceIndicator(on) {
        if (on) {
            LSTween_1.LSTween.rawTween(250)
                .onUpdate((data) => {
                let percent = data.t;
                this.activityMaterial.mainPass.in_out = percent;
            })
                .start();
        }
        else {
            LSTween_1.LSTween.rawTween(250)
                .onUpdate((data) => {
                let percent = 1 - data.t;
                this.activityMaterial.mainPass.in_out = percent;
            })
                .start();
        }
    }
    __initialize() {
        super.__initialize();
        this.asrModule = require("LensStudio:AsrModule");
        this.isRecording = false;
        this.onQueryEvent = new Event_1.default();
    }
};
exports.ASRQueryController = ASRQueryController;
exports.ASRQueryController = ASRQueryController = __decorate([
    component
], ASRQueryController);
//# sourceMappingURL=ASRQueryController.js.map