"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractableAudioFeedback = void 0;
var __selfType = requireType("./InteractableAudioFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const validate_1 = require("../../Utils/validate");
const Interactable_1 = require("../Interaction/Interactable/Interactable");
/**
 * This class provides audio feedback for interactable objects. It allows configuration of audio tracks for hover,
 * trigger start, and trigger end events. The class also provides access to the audio component for further
 * customization.
 */
let InteractableAudioFeedback = class InteractableAudioFeedback extends BaseScriptComponent {
    onAwake() {
        this.defineScriptEvents();
    }
    defineScriptEvents() {
        this.createEvent("OnStartEvent").bind(() => {
            this.init();
        });
    }
    /**
     * Set the AudioTrackAsset to play when the Interactable receives a hover event.
     */
    set hoverAudioTrack(track) {
        this._hoverAudioTrack = track;
        if (this.hoverAudioComponent !== undefined) {
            this.hoverAudioComponent.audioTrack = track;
        }
    }
    /**
     * @returns the AudioTrackAsset to play when the Interactable receives a hover event.
     */
    get hoverAudioTrack() {
        return this._hoverAudioTrack;
    }
    /**
     * Set the AudioTrackAsset to play when the Interactable receives a trigger start event.
     */
    set triggerStartAudioTrack(track) {
        this._triggerStartAudioTrack = track;
        if (this.triggerStartAudioComponent !== undefined) {
            this.triggerStartAudioComponent.audioTrack = track;
        }
    }
    /**
     * @returns the AudioTrackAsset to play when the Interactable receives a trigger start event.
     */
    get triggerStartAudioTrack() {
        return this._triggerStartAudioTrack;
    }
    /**
     * Set the AudioTrackAsset to play when the Interactable receives a trigger end event.
     */
    set triggerEndAudioTrack(track) {
        this._triggerEndAudioTrack = track;
        if (this.triggerEndAudioComponent !== undefined) {
            this.triggerEndAudioComponent.audioTrack = track;
        }
    }
    /**
     * @returns the AudioTrackAsset to play when the Interactable receives a trigger end event.
     */
    get triggerEndAudioTrack() {
        return this._triggerEndAudioTrack;
    }
    /**
     * Set if audio should play when the Interactable receives a hover event.
     */
    set playAudioOnHover(enabled) {
        var _a;
        this._playAudioOnHover = enabled;
        if (this.hoverAudioComponent === undefined) {
            this._hoverAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            this.setPlaybackMode(this._hoverAudioComponent, (_a = Audio.PlaybackMode) === null || _a === void 0 ? void 0 : _a.LowLatency);
            if (this.hoverAudioTrack === undefined) {
                this.hoverAudioTrack = requireAsset("../../Assets/Audio/HoverAudioTrack.wav");
            }
            this._hoverAudioComponent.audioTrack = this.hoverAudioTrack;
        }
    }
    /**
     * @returns if audio should play when the Interactable receives a hover event.
     */
    get playAudioOnHover() {
        return this._playAudioOnHover;
    }
    /**
     * Set if audio should play when the Interactable receives a trigger start event.
     */
    set playAudioOnTriggerStart(enabled) {
        var _a;
        this._playAudioOnTriggerStart = enabled;
        if (this.triggerStartAudioComponent === undefined) {
            this._triggerStartAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            this.setPlaybackMode(this._triggerStartAudioComponent, (_a = Audio.PlaybackMode) === null || _a === void 0 ? void 0 : _a.LowLatency);
            if (this.triggerStartAudioTrack === undefined) {
                this.triggerStartAudioTrack = requireAsset("../../Assets/Audio/TriggerStartAudioTrack.wav");
            }
            this._triggerStartAudioComponent.audioTrack = this.triggerStartAudioTrack;
        }
    }
    /**
     * @returns if audio should play when the Interactable receives a trigger start event.
     */
    get playAudioOnTriggerStart() {
        return this._playAudioOnTriggerStart;
    }
    /**
     * Set if audio should play when the Interactable receives a trigger end event.
     */
    set playAudioOnTriggerEnd(enabled) {
        var _a;
        this._playAudioOnTriggerEnd = enabled;
        if (this.triggerEndAudioComponent === undefined) {
            this._triggerEndAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            this.setPlaybackMode(this._triggerEndAudioComponent, (_a = Audio.PlaybackMode) === null || _a === void 0 ? void 0 : _a.LowLatency);
            if (this.triggerEndAudioTrack === undefined) {
                this.triggerEndAudioTrack = requireAsset("../../Assets/Audio/TriggerEndAudioTrack.wav");
            }
            this._triggerEndAudioComponent.audioTrack = this.triggerEndAudioTrack;
        }
    }
    /**
     * @returns if audio should play when the Interactable receives a trigger end event.
     */
    get playAudioOnTriggerEnd() {
        return this._playAudioOnTriggerEnd;
    }
    /**
     * Returns the AudioComponent used for hover feedback for further configuration (such as volume).
     */
    get hoverAudioComponent() {
        return this._hoverAudioComponent;
    }
    /**
     * Returns the AudioComponent used for trigger start feedback for further configuration (such as volume).
     */
    get triggerStartAudioComponent() {
        return this._triggerStartAudioComponent;
    }
    /**
     * Returns the AudioComponent used for trigger end feedback for further configuration (such as volume).
     */
    get triggerEndAudioComponent() {
        return this._triggerEndAudioComponent;
    }
    setupInteractableCallbacks() {
        (0, validate_1.validate)(this.interactable);
        this.interactable.onHoverEnter.add(() => {
            try {
                if (this.playAudioOnHover && this._hoverAudioComponent) {
                    this._hoverAudioComponent.play(1);
                }
            }
            catch (e) {
                print("Error playing hover audio: " + e);
            }
        });
        this.interactable.onTriggerStart.add(() => {
            try {
                if (this.playAudioOnTriggerStart && this._triggerStartAudioComponent) {
                    this._triggerStartAudioComponent.play(1);
                }
            }
            catch (e) {
                print("Error playing trigger start audio: " + e);
            }
        });
        this.interactable.onTriggerEnd.add(() => {
            try {
                if (this.playAudioOnTriggerEnd && this._triggerEndAudioComponent) {
                    this._triggerEndAudioComponent.play(1);
                }
            }
            catch (e) {
                print("Error playing trigger end audio: " + e);
            }
        });
    }
    init() {
        var _a, _b, _c;
        if (this.playAudioOnHover) {
            this._hoverAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            this.setPlaybackMode(this._hoverAudioComponent, (_a = Audio.PlaybackMode) === null || _a === void 0 ? void 0 : _a.LowLatency);
            if (this.hoverAudioTrack === undefined) {
                this.hoverAudioTrack = requireAsset("../../Assets/Audio/HoverAudioTrack.wav");
            }
            this._hoverAudioComponent.audioTrack = this.hoverAudioTrack;
        }
        if (this.playAudioOnTriggerStart) {
            this._triggerStartAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            this.setPlaybackMode(this._triggerStartAudioComponent, (_b = Audio.PlaybackMode) === null || _b === void 0 ? void 0 : _b.LowLatency);
            if (this.triggerStartAudioTrack === undefined) {
                this.triggerStartAudioTrack = requireAsset("../../Assets/Audio/TriggerStartAudioTrack.wav");
            }
            this._triggerStartAudioComponent.audioTrack = this.triggerStartAudioTrack;
        }
        if (this.playAudioOnTriggerEnd) {
            this._triggerEndAudioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
            this.setPlaybackMode(this._triggerEndAudioComponent, (_c = Audio.PlaybackMode) === null || _c === void 0 ? void 0 : _c.LowLatency);
            if (this.triggerEndAudioTrack === undefined) {
                this.triggerEndAudioTrack = requireAsset("../../Assets/Audio/TriggerEndAudioTrack.wav");
            }
            this._triggerEndAudioComponent.audioTrack = this.triggerEndAudioTrack;
        }
        this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
        if (!this.interactable) {
            throw new Error("Could not find Interactable component on this SceneObject.");
        }
        this.setupInteractableCallbacks();
    }
    setPlaybackMode(target, playbackMode) {
        if (playbackMode !== undefined) {
            target.playbackMode = playbackMode;
        }
    }
    __initialize() {
        super.__initialize();
        this.interactable = null;
    }
};
exports.InteractableAudioFeedback = InteractableAudioFeedback;
exports.InteractableAudioFeedback = InteractableAudioFeedback = __decorate([
    component
], InteractableAudioFeedback);
//# sourceMappingURL=InteractableAudioFeedback.js.map