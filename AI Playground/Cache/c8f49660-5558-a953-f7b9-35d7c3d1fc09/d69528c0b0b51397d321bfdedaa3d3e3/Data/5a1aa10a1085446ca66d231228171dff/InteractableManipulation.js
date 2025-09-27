"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractableManipulation = exports.RotationAxis = void 0;
var __selfType = requireType("./InteractableManipulation");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const Event_1 = require("../../../Utils/Event");
const OneEuroFilter_1 = require("../../../Utils/OneEuroFilter");
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const StateMachine_1 = require("../../../Utils/StateMachine");
const validate_1 = require("../../../Utils/validate");
const Interactable_1 = require("../Interactable/Interactable");
var RotationAxis;
(function (RotationAxis) {
    RotationAxis["All"] = "All";
    RotationAxis["X"] = "X";
    RotationAxis["Y"] = "Y";
    RotationAxis["Z"] = "Z";
})(RotationAxis || (exports.RotationAxis = RotationAxis = {}));
const TAG = "InteractableManipulation";
const MOBILE_DRAG_MULTIPLIER = 0.5;
const STRETCH_SMOOTH_SPEED = 15;
const YAW_NEGATIVE_90 = quat.fromEulerAngles(0, -90, 0);
const MAX_USER_ARM_EXTENSION_CM = 100;
const MIN_DRAG_DISTANCE_CM = 0.0001; // Setting this > 0 to avoid division by 0
const CachedTransform = {
    transform: mat4.identity(),
    position: vec3.zero(),
    rotation: quat.quatIdentity(),
    scale: vec3.one()
};
/**
 * This class provides manipulation capabilities for interactable objects, including translation, rotation, and
 * scaling. It allows configuration of the manipulation root, scale limits, and rotation axes.
 */
let InteractableManipulation = class InteractableManipulation extends BaseScriptComponent {
    /**
     * Gets the transform of the root of the manipulated object(s).
     */
    getManipulateRoot() {
        return this.manipulateRoot;
    }
    /**
     * Sets the transform of the passed SceneObject as the root of the manipulated object(s).
     */
    setManipulateRoot(root) {
        this.manipulateRoot = root;
        this.cacheTransform();
    }
    /**
     * Returns true translation is enabled
     */
    canTranslate() {
        return this.enableTranslation;
    }
    /**
     * Toggle for allowing an object to translate
     */
    setCanTranslate(enabled) {
        if (this.enableTranslation !== enabled) {
            this.enableTranslation = enabled;
            this.notifyCapabilityChanged();
        }
    }
    /**
     * Returns true if any of rotation x, y, or z is enabled
     */
    canRotate() {
        return (this.enableRotation &&
            (this.state.triggeringInteractors.length === 2 ||
                (this.state.triggeringInteractors.length === 1 && this.cachedTargetingMode === Interactor_1.TargetingMode.Direct)));
    }
    /**
     * Toggle for allowing an object to rotate
     */
    setCanRotate(enabled) {
        if (this.enableRotation !== enabled) {
            this.enableRotation = enabled;
            this.notifyCapabilityChanged();
        }
    }
    /**
     * Returns true if any of scale x, y, or z is enabled
     */
    canScale() {
        return this.enableScale && this.state.triggeringInteractors.length === 2;
    }
    /**
     * Toggle for allowing an object to scale
     */
    setCanScale(enabled) {
        if (this.enableScale !== enabled) {
            this.enableScale = enabled;
            this.notifyCapabilityChanged();
        }
    }
    /**
     * Set if translation along world X-axis is enabled.
     */
    set enableXTranslation(enabled) {
        this._enableXTranslation = enabled;
    }
    /**
     * Returns if translation along world X-axis is enabled.
     */
    get enableXTranslation() {
        return this._enableXTranslation;
    }
    /**
     * Set if translation along world Y-axis is enabled.
     */
    set enableYTranslation(enabled) {
        this._enableYTranslation = enabled;
    }
    /**
     * Returns if translation along world Y-axis is enabled.
     */
    get enableYTranslation() {
        return this._enableYTranslation;
    }
    /**
     * Set if translation along world Z-axis is enabled.
     */
    set enableZTranslation(enabled) {
        this._enableZTranslation = enabled;
    }
    /**
     * Returns if translation along world Z-axis is enabled.
     */
    get enableZTranslation() {
        return this._enableZTranslation;
    }
    /**
     * Set if rotation occurs about all axes or a single world axis (x,y,z) when using to two hands.
     */
    set rotationAxis(axis) {
        this._rotationAxis = axis;
    }
    /**
     * Get if rotation occurs about all axes or a single world axis (x,y,z) when using to two hands..
     */
    get rotationAxis() {
        return this._rotationAxis;
    }
    onAwake() {
        this.setupStateMachine();
        this.setManipulateRoot(!isNull(this.manipulateRootSceneObject) ? this.manipulateRootSceneObject.getTransform() : this.getTransform());
        this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
        this.defaultFilterConfig = {
            frequency: 60, //fps
            minCutoff: this.minCutoff,
            beta: this.beta,
            dcutoff: this.dcutoff
        };
        this.translateFilter = new OneEuroFilter_1.OneEuroFilterVec3(this.defaultFilterConfig);
        this.rotationFilter = new OneEuroFilter_1.OneEuroFilterQuat(this.defaultFilterConfig);
        this.scaleFilter = new OneEuroFilter_1.OneEuroFilterVec3(this.defaultFilterConfig);
    }
    onStart() {
        this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
        if (this.interactable === null) {
            throw new Error("InteractableManipulation requires an interactable to function.");
        }
        this.interactable.useFilteredPinch = true;
        // Temporarily limit manipulatable Interactables to not be pokeable until fixing the transition from poke to pinch.
        if ((this.interactable.targetingMode & Interactor_1.TargetingMode.Poke) !== 0) {
            this.log.e(`Poke targeting is incompatible with InteractableManipulation. Poke targeting for Interactable of ${this.sceneObject.name} will be disabled.`);
            this.interactable.targetingMode = this.interactable.targetingMode & ~Interactor_1.TargetingMode.Poke;
        }
        this.setupCallbacks();
    }
    onDestroy() {
        // If we don't unsubscribe, component will keep working after destroy() due to event callbacks added to Interactable Events
        this.unsubscribeBag.forEach((unsubscribeCallback) => {
            unsubscribeCallback();
        });
        this.unsubscribeBag = [];
    }
    setupCallbacks() {
        (0, validate_1.validate)(this.interactable);
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((event) => {
            if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerToggle(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((event) => {
            if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerUpdate(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((event) => {
            if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerToggle(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((event) => {
            if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerToggle(event);
            }
        }));
    }
    updateStartValues() {
        var _a, _b, _c, _d, _e, _f;
        (0, validate_1.validate)(this.manipulateRoot);
        (0, validate_1.validate)(this.interactable);
        this.mobileStretch = 0;
        this.smoothedStretch = 0;
        this.startStretchInteractorDistance = 0;
        // Reset filters
        this.translateFilter.reset();
        this.rotationFilter.reset();
        this.scaleFilter.reset();
        // Set the starting transform values to be used for callbacks
        this.startTransform = {
            transform: this.manipulateRoot.getWorldTransform(),
            position: this.manipulateRoot.getWorldPosition(),
            rotation: this.manipulateRoot.getWorldRotation(),
            scale: this.manipulateRoot.getWorldScale()
        };
        const cameraRotation = this.camera.getTransform().getWorldRotation();
        if (this.interactors.length === 1) {
            const interactor = this.interactors[0];
            if (this.isInteractorValid(interactor) === false) {
                this.log.e("Interactor must not be valid for setting initial values");
                return;
            }
            const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
            const orientation = (_b = interactor.orientation) !== null && _b !== void 0 ? _b : quat.quatIdentity();
            this.cachedTargetingMode = interactor.activeTargetingMode;
            if (interactor.activeTargetingMode === Interactor_1.TargetingMode.Direct) {
                this.offsetPosition = this.startTransform.position.sub(startPoint);
                this.offsetRotation = orientation.invert().multiply(this.startTransform.rotation);
            }
            else {
                const rayPosition = this.getRayPosition(interactor);
                this.offsetPosition = rayPosition.sub(startPoint);
                this.hitPointToTransform = this.startTransform.position.sub(rayPosition);
                this.offsetRotation = cameraRotation.invert().multiply(this.startTransform.rotation);
            }
        }
        else if (this.interactors.length === 2) {
            if (this.isInteractorValid(this.interactors[0]) === false ||
                this.isInteractorValid(this.interactors[1]) === false) {
                this.log.e("Both interactors must be valid for setting initial values");
                return;
            }
            const isDirect = this.interactors[0].activeTargetingMode === Interactor_1.TargetingMode.Direct ||
                this.interactors[1].activeTargetingMode === Interactor_1.TargetingMode.Direct;
            this.cachedTargetingMode = isDirect ? Interactor_1.TargetingMode.Direct : Interactor_1.TargetingMode.Indirect;
            const firstStartPoint = (_c = this.interactors[0].startPoint) !== null && _c !== void 0 ? _c : vec3.zero();
            const secondStartPoint = (_d = this.interactors[1].startPoint) !== null && _d !== void 0 ? _d : vec3.zero();
            const interactorMidPoint = firstStartPoint.add(secondStartPoint).uniformScale(0.5);
            this.currentUp = vec3.up();
            this.currentRotationSign = 0;
            const dualInteractorDirection = this.getDualInteractorDirection(this.interactors[0], this.interactors[1]);
            this.initialInteractorDistance = firstStartPoint.distance(secondStartPoint);
            this.initialObjectScale = this.manipulateRoot.getLocalScale();
            if (dualInteractorDirection === null) {
                return;
            }
            this.offsetRotation = dualInteractorDirection.invert().multiply(this.startTransform.rotation);
            if (isDirect) {
                this.offsetPosition = this.startTransform.position.sub(interactorMidPoint);
            }
            else {
                const firstRayPosition = this.getRayPosition(this.interactors[0]);
                const secondRayPosition = this.getRayPosition(this.interactors[1]);
                const dualRayPosition = firstRayPosition.add(secondRayPosition).uniformScale(0.5);
                const direction0 = (_e = this.interactors[0].direction) !== null && _e !== void 0 ? _e : vec3.zero();
                const direction1 = (_f = this.interactors[1].direction) !== null && _f !== void 0 ? _f : vec3.zero();
                const dualDirection = direction0.add(direction1).uniformScale(0.5);
                const dualRaycastDistance = (this.interactors[0].maxRaycastDistance + this.interactors[1].maxRaycastDistance) * 0.5;
                const rayMidpointToInteractorDistance = dualRayPosition.distance(interactorMidPoint);
                const projectedHitDistance = Math.min(dualRaycastDistance, rayMidpointToInteractorDistance);
                const hitPoint = interactorMidPoint.add(dualDirection.uniformScale(projectedHitDistance));
                this.offsetPosition = dualRayPosition.sub(interactorMidPoint);
                this.hitPointToTransform = this.startTransform.position.sub(hitPoint);
            }
        }
    }
    /**
     * Hit position from interactor does not necessarily mean the actual
     * ray position. We need to maintain offset so that there's isn't a pop
     * on pickup.
     */
    getRayPosition(interactor) {
        var _a, _b, _c;
        if (this.isInteractorValid(interactor) === false) {
            return vec3.zero();
        }
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const direction = (_b = interactor.direction) !== null && _b !== void 0 ? _b : vec3.zero();
        const distanceToTarget = (_c = interactor.distanceToTarget) !== null && _c !== void 0 ? _c : 0;
        return startPoint.add(direction.uniformScale(distanceToTarget));
    }
    cacheTransform() {
        (0, validate_1.validate)(this.manipulateRoot);
        this.originalWorldTransform = {
            transform: this.manipulateRoot.getWorldTransform(),
            position: this.manipulateRoot.getWorldPosition(),
            rotation: this.manipulateRoot.getWorldRotation(),
            scale: this.manipulateRoot.getWorldScale()
        };
        this.originalLocalTransform = {
            transform: mat4.compose(this.manipulateRoot.getLocalPosition(), this.manipulateRoot.getLocalRotation(), this.manipulateRoot.getLocalScale()),
            position: this.manipulateRoot.getLocalPosition(),
            rotation: this.manipulateRoot.getLocalRotation(),
            scale: this.manipulateRoot.getLocalScale()
        };
    }
    resetActiveEvents() {
        this.state.activeEvents.translation = false;
        this.state.activeEvents.rotation = false;
        this.state.activeEvents.scale = false;
        this.state.activeEvents.manipulation = false;
    }
    setupStateMachine() {
        this.state.previousCapabilitiesState = {
            enabled: this.enabled,
            canTranslate: this.canTranslate(),
            canRotate: this.canRotate(),
            canScale: this.canScale()
        };
        this.state.stateMachine.addState({
            name: this.state.states.Idle,
            onEnter: () => {
                this.log.v("Entered Idle state");
                this.interactors = [];
                this.resetActiveEvents();
            },
            transitions: [
                {
                    nextStateName: this.state.states.Active,
                    checkOnSignal: (signal, data) => {
                        var _a;
                        return (signal === this.state.signals.StartManipulation &&
                            this.hasActiveCapabilities() &&
                            ((_a = data === null || data === void 0 ? void 0 : data.interactors) === null || _a === void 0 ? void 0 : _a.length) > 0);
                    }
                }
            ]
        });
        this.state.stateMachine.addState({
            name: this.state.states.Active,
            onEnter: () => {
                this.log.v("Entered Active state");
                this.startManipulation(this.state.triggeringInteractors);
            },
            onUpdate: () => {
                this.performManipulation();
            },
            onExit: () => {
                this.log.v("Exited Active state");
                this.endManipulation();
            },
            onSignal: (signal, data) => {
                if (signal === this.state.signals.ChangeInteractors && (data === null || data === void 0 ? void 0 : data.interactors)) {
                    this.log.v("Handling interactor change within Active state");
                    this.interactors = data.interactors;
                    this.updateStartValues();
                    this.updateEventStates();
                }
                else if (signal === this.state.signals.CapabilitiesChanged) {
                    this.log.v("Handling capability changes within Active state");
                    this.updateStartValues();
                    this.updateEventStates();
                }
            },
            transitions: [
                {
                    nextStateName: this.state.states.Idle,
                    checkOnSignal: (signal) => {
                        return signal === this.state.signals.EndManipulation;
                    }
                }
            ]
        });
        this.state.stateMachine.enterState(this.state.states.Idle);
    }
    hasActiveCapabilities() {
        return this.enabled && (this.canTranslate() || this.canRotate() || this.canScale());
    }
    onTriggerToggle(_eventData) {
        var _a;
        const previousInteractors = this.interactors;
        const currentInteractors = this.getTriggeringInteractors();
        this.log.v(`onTriggerToggle called with ${currentInteractors.length} interactors`);
        this.state.triggeringInteractors = currentInteractors;
        const currentState = (_a = this.state.stateMachine.currentState) === null || _a === void 0 ? void 0 : _a.name;
        const hasCapabilities = this.hasActiveCapabilities();
        // Try transition to Active
        if (currentState === this.state.states.Idle && currentInteractors.length > 0 && hasCapabilities) {
            this.log.v("Attempting transition: Idle -> Active");
            this.state.stateMachine.sendSignal(this.state.signals.StartManipulation, {
                interactors: currentInteractors
            });
        }
        // Try transition to Idle
        if (currentState === this.state.states.Active && (currentInteractors.length === 0 || !hasCapabilities)) {
            this.log.v("Attempting transition: Active -> Idle");
            this.state.stateMachine.sendSignal(this.state.signals.EndManipulation);
        }
        // Try update if Interactors changed
        if (currentState === this.state.states.Active &&
            hasCapabilities &&
            currentInteractors.length > 0 &&
            this.interactorsChanged(previousInteractors, currentInteractors)) {
            this.log.v("Attempting to update interactors within Active state");
            this.state.stateMachine.sendSignal(this.state.signals.ChangeInteractors, { interactors: currentInteractors });
        }
    }
    onTriggerUpdate(_eventData) {
        this.notifyCapabilityChanged();
    }
    getCurrentCapabilitiesState() {
        return {
            enabled: this.enabled,
            canTranslate: this.canTranslate(),
            canRotate: this.canRotate(),
            canScale: this.canScale()
        };
    }
    capabilitiesChanged(previous, current) {
        return (previous.enabled !== current.enabled ||
            previous.canTranslate !== current.canTranslate ||
            previous.canRotate !== current.canRotate ||
            previous.canScale !== current.canScale);
    }
    notifyCapabilityChanged() {
        const currentCapabilities = this.getCurrentCapabilitiesState();
        if (this.capabilitiesChanged(this.state.previousCapabilitiesState, currentCapabilities)) {
            this.handleCapabilityChange(this.hasActiveCapabilities());
            this.state.previousCapabilitiesState = currentCapabilities;
        }
    }
    handleCapabilityChange(hasCapabilities) {
        var _a;
        const currentState = (_a = this.state.stateMachine.currentState) === null || _a === void 0 ? void 0 : _a.name;
        if (!hasCapabilities && currentState === this.state.states.Active) {
            this.log.v("All capabilities disabled during active manipulation, ending manipulation");
            this.state.stateMachine.sendSignal(this.state.signals.EndManipulation);
        }
        else if (hasCapabilities &&
            currentState === this.state.states.Active &&
            this.state.triggeringInteractors.length > 0) {
            this.log.v("Capabilities changed during active manipulation");
            this.state.stateMachine.sendSignal(this.state.signals.CapabilitiesChanged);
        }
        else if (hasCapabilities &&
            currentState === this.state.states.Idle &&
            this.state.triggeringInteractors.length > 0) {
            this.log.v("Capabilities enabled while in Idle state, starting manipulation");
            this.state.stateMachine.sendSignal(this.state.signals.StartManipulation, {
                interactors: this.state.triggeringInteractors
            });
        }
    }
    updateEventStates() {
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.manipulateRoot);
        const canTranslate = this.canTranslate();
        const canRotate = this.canRotate();
        const canScale = this.canScale();
        // Handle translation events
        if (canTranslate && !this.state.activeEvents.translation) {
            this.state.activeEvents.translation = true;
            this.invokeTranslationStart();
        }
        else if (!canTranslate && this.state.activeEvents.translation) {
            this.state.activeEvents.translation = false;
            this.invokeTranslationEnd();
        }
        // Handle rotation events
        if (canRotate && !this.state.activeEvents.rotation) {
            this.state.activeEvents.rotation = true;
            this.invokeRotationStart();
        }
        else if (!canRotate && this.state.activeEvents.rotation) {
            this.state.activeEvents.rotation = false;
            this.invokeRotationEnd();
        }
        // Handle scale events
        if (canScale && !this.state.activeEvents.scale) {
            this.state.activeEvents.scale = true;
            this.invokeScaleStart();
        }
        else if (!canScale && this.state.activeEvents.scale) {
            this.state.activeEvents.scale = false;
            this.invokeScaleEnd();
        }
    }
    startManipulation(interactors) {
        this.log.v(`startManipulation called with ${interactors.length} interactors`);
        this.interactors = interactors;
        this.updateStartValues();
        this.state.activeEvents.manipulation = true;
        this.state.activeEvents.translation = this.canTranslate();
        this.state.activeEvents.rotation = this.canRotate();
        this.state.activeEvents.scale = this.canScale();
        this.invokeManipulationStart();
        if (this.state.activeEvents.translation) {
            this.invokeTranslationStart();
        }
        if (this.state.activeEvents.rotation) {
            this.invokeRotationStart();
        }
        if (this.state.activeEvents.scale) {
            this.invokeScaleStart();
        }
    }
    performManipulation() {
        const canTranslate = this.canTranslate();
        const canRotate = this.canRotate();
        const canScale = this.canScale();
        if (this.interactors.length === 1) {
            this.singleInteractorTransform(this.interactors[0]);
        }
        else if (this.interactors.length === 2) {
            this.dualInteractorsTransform(this.interactors);
        }
        else {
            this.log.e(`${this.interactors.length} interactors found for manipulation. This is not supported.`);
            return;
        }
        if (canTranslate) {
            this.invokeTranslationUpdate();
        }
        if (canRotate) {
            this.invokeRotationUpdate();
        }
        if (canScale) {
            this.invokeScaleUpdate();
        }
        if (canTranslate || canRotate || canScale) {
            this.invokeManipulationUpdate();
        }
    }
    endManipulation() {
        this.log.v(`endManipulation called with ${this.interactors.length} interactors`);
        if (this.state.activeEvents.translation) {
            this.invokeTranslationEnd();
            this.state.activeEvents.translation = false;
        }
        if (this.state.activeEvents.rotation) {
            this.invokeRotationEnd();
            this.state.activeEvents.rotation = false;
        }
        if (this.state.activeEvents.scale) {
            this.invokeScaleEnd();
            this.state.activeEvents.scale = false;
        }
        if (this.state.activeEvents.manipulation) {
            this.invokeManipulationEnd();
            this.state.activeEvents.manipulation = false;
        }
    }
    interactorsChanged(previous, current) {
        if (previous.length !== current.length)
            return true;
        return previous.some((prev, i) => prev !== current[i]);
    }
    getTriggeringInteractors() {
        (0, validate_1.validate)(this.interactable);
        let interactors = this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor);
        interactors = interactors.filter((interactor) => {
            return (interactor.currentInteractable === this.interactable && interactor.currentTrigger !== Interactor_1.InteractorTriggerType.None);
        });
        if (interactors === null) {
            this.log.w(`Failed to retrieve interactors on ${this.getSceneObject().name}: ${this.interactable.triggeringInteractor} (InteractorInputType)`);
            return [];
        }
        return interactors;
    }
    invokeEvent(event, createArgs) {
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.manipulateRoot);
        event.invoke(createArgs());
    }
    // Event args creator helpers
    createTranslationEventArgs() {
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.manipulateRoot);
        return {
            interactors: this.interactors,
            interactable: this.interactable,
            startPosition: this.startTransform.position,
            currentPosition: this.manipulateRoot.getWorldPosition()
        };
    }
    createRotationEventArgs() {
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.manipulateRoot);
        return {
            interactors: this.interactors,
            interactable: this.interactable,
            startRotation: this.startTransform.rotation,
            currentRotation: this.manipulateRoot.getWorldRotation()
        };
    }
    createScaleEventArgs() {
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.manipulateRoot);
        return {
            interactors: this.interactors,
            interactable: this.interactable,
            startWorldScale: this.startTransform.scale,
            currentWorldScale: this.manipulateRoot.getWorldScale()
        };
    }
    createManipulationEventArgs() {
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.manipulateRoot);
        return {
            interactors: this.interactors,
            interactable: this.interactable,
            startTransform: this.startTransform.transform,
            currentTransform: this.manipulateRoot.getWorldTransform()
        };
    }
    // Translation events
    invokeTranslationStart() {
        this.invokeEvent(this.onTranslationStartEvent, () => this.createTranslationEventArgs());
    }
    invokeTranslationUpdate() {
        this.invokeEvent(this.onTranslationUpdateEvent, () => this.createTranslationEventArgs());
    }
    invokeTranslationEnd() {
        this.invokeEvent(this.onTranslationEndEvent, () => this.createTranslationEventArgs());
    }
    // Rotation events
    invokeRotationStart() {
        this.invokeEvent(this.onRotationStartEvent, () => this.createRotationEventArgs());
    }
    invokeRotationUpdate() {
        this.invokeEvent(this.onRotationUpdateEvent, () => this.createRotationEventArgs());
    }
    invokeRotationEnd() {
        this.invokeEvent(this.onRotationEndEvent, () => this.createRotationEventArgs());
    }
    // Scale events
    invokeScaleStart() {
        this.invokeEvent(this.onScaleStartEvent, () => this.createScaleEventArgs());
    }
    invokeScaleUpdate() {
        this.invokeEvent(this.onScaleUpdateEvent, () => this.createScaleEventArgs());
    }
    invokeScaleEnd() {
        this.invokeEvent(this.onScaleEndEvent, () => this.createScaleEventArgs());
    }
    // Manipulation events
    invokeManipulationStart() {
        this.invokeEvent(this.onManipulationStartEvent, () => this.createManipulationEventArgs());
    }
    invokeManipulationUpdate() {
        this.invokeEvent(this.onManipulationUpdateEvent, () => this.createManipulationEventArgs());
    }
    invokeManipulationEnd() {
        this.invokeEvent(this.onManipulationEndEvent, () => this.createManipulationEventArgs());
    }
    getDualInteractorDirection(interactor1, interactor2) {
        if (interactor1 === null ||
            interactor1.startPoint === null ||
            interactor2 === null ||
            interactor2.startPoint === null) {
            this.log.e("Interactors and their start points should not be null for getDualInteractorDirection");
            return null;
        }
        let point1 = interactor1.startPoint;
        let point2 = interactor2.startPoint;
        let sign = 0;
        // Handle single axis rotation by projecting the start points onto plane.
        if (this.rotationAxis !== RotationAxis.All) {
            let axis;
            switch (this.rotationAxis) {
                case RotationAxis.X:
                    axis = vec3.right();
                    break;
                case RotationAxis.Y:
                    axis = vec3.up();
                    break;
                case RotationAxis.Z:
                    axis = vec3.forward();
                    break;
            }
            // When rotating about a single axis, project the start points onto the plane defined by that axis to calculate rotation about that axis.
            point1 = point1.projectOnPlane(axis);
            point2 = point2.projectOnPlane(axis);
            if (this.rotationAxis === RotationAxis.X) {
                sign = Math.sign(point2.z - point1.z);
            }
            else if (this.rotationAxis === RotationAxis.Z) {
                sign = Math.sign(point2.x - point1.x);
            }
        }
        // For X and Z rotation, flip the 'up' orientation of the rotation when the vector between the projected points crosses the Y-axis.
        if (sign !== this.currentRotationSign) {
            this.currentUp = this.currentUp.uniformScale(-1);
            this.currentRotationSign = sign;
        }
        // Get the direction from the two palm points, rotate yaw 90 degrees to get forward direction
        const rotation = quat.lookAt(point2.sub(point1), this.currentUp).multiply(YAW_NEGATIVE_90);
        const currentRotation = this.limitQuatRotation(rotation);
        return currentRotation;
    }
    limitQuatRotation(rotation) {
        if (!this.canRotate()) {
            return quat.quatIdentity();
        }
        return rotation;
    }
    isInteractorValid(interactor) {
        return (interactor !== null &&
            interactor.startPoint !== null &&
            interactor.orientation !== null &&
            interactor.direction !== null &&
            interactor.distanceToTarget !== null &&
            interactor.isActive());
    }
    singleInteractorTransform(interactor) {
        var _a, _b, _c;
        if (this.isInteractorValid(interactor) === false) {
            this.log.e("Interactor must be valid");
            return;
        }
        (0, validate_1.validate)(this.manipulateRoot);
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const orientation = (_b = interactor.orientation) !== null && _b !== void 0 ? _b : quat.quatIdentity();
        const direction = (_c = interactor.direction) !== null && _c !== void 0 ? _c : vec3.zero();
        const limitRotation = this.limitQuatRotation(orientation).multiply(this.offsetRotation);
        // Do not rotate the object if using a single Interactor for single axis usecase.
        let deltaRotation = this.rotationAxis === RotationAxis.All
            ? limitRotation.multiply(this.manipulateRoot.getWorldRotation().invert())
            : quat.quatIdentity();
        // Single Interactor Direct
        if (this.enableTranslation) {
            let newPosition;
            if (this.cachedTargetingMode === Interactor_1.TargetingMode.Direct) {
                newPosition = startPoint.add(this.canRotate()
                    ? limitRotation.multiply(this.startTransform.rotation.invert()).multiplyVec3(this.offsetPosition)
                    : this.offsetPosition);
                this.updatePosition(newPosition, this.useFilter);
            }
            else {
                // Single Interactor Indirect
                this.smoothedStretch = MathUtils.lerp(this.smoothedStretch, this.calculateStretchFactor(interactor), getDeltaTime() * STRETCH_SMOOTH_SPEED);
                const offset = direction.uniformScale(this.offsetPosition.length).add(this.hitPointToTransform);
                newPosition = startPoint.add(offset).add(direction.uniformScale(this.smoothedStretch));
                this.updatePosition(newPosition, this.useFilter);
                deltaRotation = quat.quatIdentity();
            }
        }
        if (this.canRotate()) {
            if (this.cachedTargetingMode === Interactor_1.TargetingMode.Direct) {
                const newRotation = deltaRotation.multiply(this.manipulateRoot.getWorldRotation());
                this.updateRotation(newRotation, this.useFilter);
            }
        }
    }
    dualInteractorsTransform(interactors) {
        var _a, _b;
        if (interactors.length < 2 || !this.isInteractorValid(interactors[0]) || !this.isInteractorValid(interactors[1])) {
            this.log.e("There should be two valid interactors for dualInteractorsTransform");
            return;
        }
        (0, validate_1.validate)(this.manipulateRoot);
        (0, validate_1.validate)(this.interactable);
        const isDirect = this.cachedTargetingMode === Interactor_1.TargetingMode.Direct;
        const startPoint1 = interactors[0].startPoint;
        const startPoint2 = interactors[1].startPoint;
        if (startPoint1 === null || startPoint2 === null) {
            this.log.e("Both start points should be valid for dualInteractorsTransform");
            return;
        }
        const interactorMidPoint = startPoint1.add(startPoint2).uniformScale(0.5);
        const dualDirection = this.getDualInteractorDirection(interactors[0], interactors[1]);
        if (dualDirection === null) {
            return;
        }
        const dualDistance = startPoint1.distance(startPoint2);
        if (this.canRotate()) {
            const newRotation = dualDirection.multiply(this.offsetRotation);
            this.updateRotation(newRotation, this.useFilter);
        }
        if (this.enableTranslation) {
            let newPosition;
            // Dual Interactor Direct
            if (isDirect) {
                newPosition =
                    this.canRotate() && isDirect
                        ? interactorMidPoint.add(this.manipulateRoot
                            .getWorldRotation()
                            .multiply(this.startTransform.rotation.invert())
                            .multiplyVec3(this.offsetPosition))
                        : interactorMidPoint.add(this.offsetPosition);
                this.updatePosition(newPosition, this.useFilter);
            }
            else {
                // Dual Interactor Indirect
                const dualRaycastDistance = (interactors[0].maxRaycastDistance + interactors[1].maxRaycastDistance) * 0.5;
                const zDistance = Math.min(dualRaycastDistance, this.offsetPosition.length);
                const direction0 = (_a = interactors[0].direction) !== null && _a !== void 0 ? _a : vec3.zero();
                const direction1 = (_b = interactors[1].direction) !== null && _b !== void 0 ? _b : vec3.zero();
                const dualDirection = direction0.add(direction1).uniformScale(0.5);
                const finalOffset = dualDirection.uniformScale(zDistance).add(this.hitPointToTransform);
                newPosition = interactorMidPoint.add(finalOffset);
                this.updatePosition(newPosition, this.useFilter);
            }
        }
        if (this.canScale() && this.initialInteractorDistance !== 0) {
            const distanceDifference = dualDistance - this.initialInteractorDistance;
            /*
             * Calculate the scaling factor based on the distanceDifference and the initialInteractorDistance.
             * This factor will be used to uniformly scale the object based on the change in distance.
             */
            const uniformScalingFactor = 1 + distanceDifference / this.initialInteractorDistance;
            const updatedObjectScale = this.initialObjectScale.uniformScale(uniformScalingFactor);
            this.setScale(updatedObjectScale, this.useFilter);
        }
    }
    updatePosition(newPosition, useFilter = true) {
        if (newPosition === null) {
            return;
        }
        (0, validate_1.validate)(this.manipulateRoot);
        if (!this.enableXTranslation) {
            newPosition.x = this.manipulateRoot.getWorldPosition().x;
        }
        if (!this.enableYTranslation) {
            newPosition.y = this.manipulateRoot.getWorldPosition().y;
        }
        if (!this.enableZTranslation) {
            newPosition.z = this.manipulateRoot.getWorldPosition().z;
        }
        if (useFilter) {
            newPosition = this.translateFilter.filter(newPosition, getTime());
        }
        this.manipulateRoot.setWorldPosition(newPosition);
    }
    updateRotation(newRotation, useFilter = true) {
        if (newRotation === null) {
            return;
        }
        (0, validate_1.validate)(this.manipulateRoot);
        if (useFilter) {
            newRotation = this.rotationFilter.filter(newRotation, getTime());
        }
        this.manipulateRoot.setWorldRotation(newRotation);
    }
    calculateStretchFactor(interactor) {
        var _a, _b;
        if (this.enableStretchZ === false) {
            return 1;
        }
        // Get distance from hand to camera along z axis only
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const interactorDistance = this.camera.getTransform().getInvertedWorldTransform().multiplyPoint(startPoint).z * -1;
        if (this.startStretchInteractorDistance === 0) {
            this.startStretchInteractorDistance = interactorDistance;
        }
        const dragAmount = interactorDistance - this.startStretchInteractorDistance;
        /*
         * Subtracting MAX_USER_ARM_EXTENSION_CM to ensure that the user can still interact with the interactable anywhere within their
         * normal range of motion. Without this, if you push the interactable out to the maxRaycastDistance and your arm is fully extended,
         * you will need to move closer to the interactable to interact with it again.
         */
        const maxDragDistance = Math.max(MIN_DRAG_DISTANCE_CM, interactor.maxRaycastDistance - MAX_USER_ARM_EXTENSION_CM);
        //scale movement based on distance from ray start to object
        const currDistance = (_b = interactor.distanceToTarget) !== null && _b !== void 0 ? _b : 0;
        const distanceFactor = (this.zStretchFactorMax / maxDragDistance) * currDistance + this.zStretchFactorMin;
        const minStretch = -this.offsetPosition.length + 1;
        const maxStretch = Math.max(minStretch, -this.offsetPosition.length + maxDragDistance - 1);
        let finalStretchAmount = MathUtils.clamp(dragAmount * distanceFactor, minStretch, maxStretch);
        if ((interactor.inputType & Interactor_1.InteractorInputType.Mobile) !== 0) {
            const mobileInteractor = interactor;
            let mobileDragVector = vec3.zero();
            if (mobileInteractor.touchpadDragVector !== null) {
                mobileDragVector = mobileInteractor.touchpadDragVector;
            }
            const mobileMoveAmount = mobileDragVector.z === 0 ? mobileDragVector.y * MOBILE_DRAG_MULTIPLIER : 0;
            this.mobileStretch += mobileMoveAmount * distanceFactor;
            // Don't let value accumulate out of bounds
            this.mobileStretch = Math.min(maxStretch - finalStretchAmount, Math.max(minStretch - finalStretchAmount, this.mobileStretch));
            finalStretchAmount += this.mobileStretch;
        }
        return finalStretchAmount;
    }
    clampUniformScale(scale, minScale, maxScale) {
        let finalScale = scale;
        /*
         * Calculate the ratios between the input scale and the min and max scales
         * for each axis (x, y, z). These ratios indicate how close the input scale
         * is to the min or max scale limits.
         */
        const minRatio = Math.min(scale.x / minScale.x, scale.y / minScale.y, scale.z / minScale.z);
        const maxRatio = Math.max(scale.x / maxScale.x, scale.y / maxScale.y, scale.z / maxScale.z);
        /*
         * If the minRatio is less than 1, it means at least one axis of the input
         * scale is smaller than the corresponding axis of the minScale. To preserve
         * the uniform scaling, apply a uniform scaling factor (1 / minRatio) to the
         * input scale, effectively scaling it up just enough to meet the minScale
         * limit on the smallest axis.
         */
        if (minRatio < 1) {
            finalScale = finalScale.uniformScale(1 / minRatio);
        }
        /*
         * If the maxRatio is greater than 1, it means at least one axis of the input
         * scale is larger than the corresponding axis of the maxScale. To preserve
         * the uniform scaling, apply a uniform scaling factor (1 / maxRatio) to the
         * input scale, effectively scaling it down just enough to meet the maxScale
         * limit on the largest axis.
         */
        if (maxRatio > 1) {
            finalScale = finalScale.uniformScale(1 / maxRatio);
        }
        return finalScale;
    }
    setScale(newScale, useFilter = true) {
        if (!this.canScale()) {
            return;
        }
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.manipulateRoot);
        // Calculate min and max scale
        const minScale = this.originalLocalTransform.scale.uniformScale(this.minimumScaleFactor);
        const maxScale = this.originalLocalTransform.scale.uniformScale(this.maximumScaleFactor);
        // Calculate final scale
        let finalScale = this.clampUniformScale(newScale, minScale, maxScale);
        if (newScale !== finalScale) {
            this.onScaleLimitReachedEvent.invoke({
                interactors: this.interactors,
                interactable: this.interactable,
                currentValue: finalScale
            });
        }
        if (useFilter) {
            finalScale = this.scaleFilter.filter(finalScale, getTime());
        }
        this.manipulateRoot.setLocalScale(finalScale);
    }
    /**
     * Resets the interactable's position
     */
    resetPosition(local = false) {
        (0, validate_1.validate)(this.manipulateRoot);
        if (local) {
            this.manipulateRoot.setLocalPosition(this.originalLocalTransform.position);
        }
        else {
            this.manipulateRoot.setWorldPosition(this.originalWorldTransform.position);
        }
    }
    /**
     * Resets the interactable's rotation
     */
    resetRotation(local = false) {
        (0, validate_1.validate)(this.manipulateRoot);
        if (local) {
            this.manipulateRoot.setLocalRotation(this.originalLocalTransform.rotation);
        }
        else {
            this.manipulateRoot.setWorldRotation(this.originalWorldTransform.rotation);
        }
    }
    /**
     * Resets the interactable's scale
     */
    resetScale(local = false) {
        (0, validate_1.validate)(this.manipulateRoot);
        if (local) {
            this.manipulateRoot.setLocalScale(this.originalLocalTransform.scale);
        }
        else {
            this.manipulateRoot.setWorldScale(this.originalWorldTransform.scale);
        }
    }
    /**
     * Resets the interactable's transform
     */
    resetTransform(local = false) {
        (0, validate_1.validate)(this.manipulateRoot);
        if (local) {
            this.manipulateRoot.setLocalTransform(this.originalLocalTransform.transform);
        }
        else {
            this.manipulateRoot.setWorldTransform(this.originalWorldTransform.transform);
        }
    }
    __initialize() {
        super.__initialize();
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this.unsubscribeBag = [];
        this.interactable = null;
        this.log = new NativeLogger_1.default(TAG);
        this.state = {
            stateMachine: new StateMachine_1.default("InteractableManipulation"),
            triggeringInteractors: [],
            previousCapabilitiesState: {
                enabled: true,
                canTranslate: true,
                canRotate: true,
                canScale: true
            },
            activeEvents: {
                translation: false,
                rotation: false,
                scale: false,
                manipulation: false
            },
            states: {
                Idle: "Idle",
                Active: "Active"
            },
            signals: {
                StartManipulation: "StartManipulation",
                EndManipulation: "EndManipulation",
                ChangeInteractors: "ChangeInteractors",
                CapabilitiesChanged: "CapabilitiesChanged"
            }
        };
        this.originalWorldTransform = CachedTransform;
        this.originalLocalTransform = CachedTransform;
        this.startTransform = CachedTransform;
        this.offsetPosition = vec3.zero();
        this.offsetRotation = quat.quatIdentity();
        this.initialInteractorDistance = 0;
        this.startStretchInteractorDistance = 0;
        this.mobileStretch = 0;
        this.smoothedStretch = 0;
        this.initialObjectScale = vec3.zero();
        this.hitPointToTransform = vec3.zero();
        this.interactors = [];
        this.cachedTargetingMode = Interactor_1.TargetingMode.None;
        this.currentRotationSign = 0;
        this.currentUp = vec3.zero();
        this.onTranslationStartEvent = new Event_1.default();
        this.
        /**
         * Callback for when translation begins
         */
        onTranslationStart = this.onTranslationStartEvent.publicApi();
        this.onTranslationUpdateEvent = new Event_1.default();
        this.
        /**
         * Callback for when translation updates each frame
         */
        onTranslationUpdate = this.onTranslationUpdateEvent.publicApi();
        this.onTranslationEndEvent = new Event_1.default();
        this.
        /**
         * Callback for when translation has ended
         */
        onTranslationEnd = this.onTranslationEndEvent.publicApi();
        this.onRotationStartEvent = new Event_1.default();
        this.
        /**
         * Callback for when rotation begins
         */
        onRotationStart = this.onRotationStartEvent.publicApi();
        this.onRotationUpdateEvent = new Event_1.default();
        this.
        /**
         * Callback for when rotation updates each frame
         */
        onRotationUpdate = this.onRotationUpdateEvent.publicApi();
        this.onRotationEndEvent = new Event_1.default();
        this.
        /**
         * Callback for when rotation has ended
         */
        onRotationEnd = this.onRotationEndEvent.publicApi();
        this.onScaleLimitReachedEvent = new Event_1.default();
        this.
        /**
         * Callback for when scale has reached the minimum or maximum limit
         */
        onScaleLimitReached = this.onScaleLimitReachedEvent.publicApi();
        this.onScaleStartEvent = new Event_1.default();
        this.
        /**
         * Callback for when scale begins
         */
        onScaleStart = this.onScaleStartEvent.publicApi();
        this.onScaleUpdateEvent = new Event_1.default();
        this.
        /**
         * Callback for when scale updates each frame
         */
        onScaleUpdate = this.onScaleUpdateEvent.publicApi();
        this.onScaleEndEvent = new Event_1.default();
        this.
        /**
         * Callback for when scale has ended
         */
        onScaleEnd = this.onScaleEndEvent.publicApi();
        this.onManipulationStartEvent = new Event_1.default();
        this.
        /**
         * Callback for when any manipulation begins
         */
        onManipulationStart = this.onManipulationStartEvent.publicApi();
        this.onManipulationUpdateEvent = new Event_1.default();
        this.
        /**
         * Callback for when any manipulation updates
         */
        onManipulationUpdate = this.onManipulationUpdateEvent.publicApi();
        this.onManipulationEndEvent = new Event_1.default();
        this.
        /**
         * Callback for when any manipulation ends
         */
        onManipulationEnd = this.onManipulationEndEvent.publicApi();
    }
};
exports.InteractableManipulation = InteractableManipulation;
exports.InteractableManipulation = InteractableManipulation = __decorate([
    component
], InteractableManipulation);
//# sourceMappingURL=InteractableManipulation.js.map