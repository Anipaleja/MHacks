import {DragInteractorEvent, InteractorEvent} from "../../../Core/Interactor/InteractorEvent"

import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {InteractorInputType} from "../../../Core/Interactor/Interactor"
import {InteractionConfigurationProvider} from "../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import Event from "../../../Utils/Event"
import NativeLogger from "../../../Utils/NativeLogger"

export type InteractableEventArgs = Omit<InteractorEvent, "interactable">

const TAG = "Interactable"

/**
 * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
 * Setting an Interactable's acceptableInputType to a non-All value results in the Interactable only being
 * able to be interacted with by a specific user.
 * Host means that only the host of the session can interact.
 * Local means only the user with the same connection ID as the
 * Interactable's localConnectionId can interact.
 * HostAndLocal means that the host or the local user can interact.
 */
export enum SyncInteractionType {
  None = 0,
  Host = 1 << 0,
  Local = 1 << 1,
  Other = 1 << 2,
  HostAndLocal = Host | Local,
  All = Host | Local | Other
}

/**
 * This class represents an interactable object that can respond to various interaction events such as hover, trigger,
 * and drag. It provides event handlers for these interactions and uses the InteractionConfigurationProvider for
 * configuration.
 */
@component
export class Interactable extends BaseScriptComponent {
  // Events
  private onHoverEnterEvent = new Event<InteractorEvent>()
  private onHoverUpdateEvent = new Event<InteractorEvent>()
  private onHoverExitEvent = new Event<InteractorEvent>()
  private onInteractorHoverEnterEvent = new Event<InteractorEvent>()
  private onInteractorHoverExitEvent = new Event<InteractorEvent>()

  private onTriggerStartEvent = new Event<InteractorEvent>()
  private onTriggerUpdateEvent = new Event<InteractorEvent>()
  private onTriggerEndEvent = new Event<InteractorEvent>()
  private onInteractorTriggerStartEvent = new Event<InteractorEvent>()
  private onInteractorTriggerEndEvent = new Event<InteractorEvent>()

  private onDragStartEvent = new Event<DragInteractorEvent>()
  private onDragUpdateEvent = new Event<DragInteractorEvent>()
  private onDragEndEvent = new Event<DragInteractorEvent>()
  private onTriggerCanceledEvent = new Event<InteractorEvent>()

  private interactionConfigurationProvider: InteractionConfigurationProvider =
    InteractionConfigurationProvider.getInstance()

  // Native Logging
  private log = new NativeLogger(TAG)

  /**
   * Called whenever the interactable enters the hovered state.
   */
  onHoverEnter = this.onHoverEnterEvent.publicApi()

  /**
   * Called whenever a new interactor hovers over this interactable.
   */
  onInteractorHoverEnter = this.onInteractorHoverEnterEvent.publicApi()

  /**
   * Called whenever an interactor remains hovering over this interactable.
   */
  onHoverUpdate = this.onHoverUpdateEvent.publicApi()

  /**
   *  Called whenever the interactable is no longer hovered.
   */
  onHoverExit = this.onHoverExitEvent.publicApi()

  /**
   * Called whenever an interactor exits hovering this interactable.
   */
  onInteractorHoverExit = this.onInteractorHoverExitEvent.publicApi()

  /**
   * Called whenever the interactable enters the triggered state.
   */
  onTriggerStart = this.onTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor triggers an interactable.
   */
  onInteractorTriggerStart = this.onInteractorTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor continues to trigger an interactable.
   */
  onTriggerUpdate = this.onTriggerUpdateEvent.publicApi()

  /**
   * Called whenever the interactable exits the triggered state.
   */
  onTriggerEnd = this.onTriggerEndEvent.publicApi()

  /**
   * Called whenever an interactor is no longer triggering the interactable.
   */
  onInteractorTriggerEnd = this.onInteractorTriggerEndEvent.publicApi()

  /**
   * Called whenever an interactor is lost and was in a down event with this interactable.
   */
  onTriggerCanceled = this.onTriggerCanceledEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * has moved a minimum drag distance.
   */
  onDragStart = this.onDragStartEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * is moving.
   */
  onDragUpdate = this.onDragUpdateEvent.publicApi()

  /**
   * Called when an interactor was in a down event with this interactable and
   * was dragging.
   */
  onDragEnd = this.onDragEndEvent.publicApi()

  // Interactor
  private _hoveringInteractor: InteractorInputType = InteractorInputType.None
  private _triggeringInteractor: InteractorInputType = InteractorInputType.None

  /**
   * Provides all colliders associated with this Interactable.
   */
  colliders: ColliderComponent[] = []

  /**
   * Defines how an interactor can interact with this interactable.
   * Values are:
   * 1: Direct: Only allows close pinch interactions where a hand directly touches the Interactable.
   * 2: Indirect: Allows interactions from a distance with raycasting.
   * 3: Direct/Indirect: Supports both direct and indirect interaction methods.
   * 4: Poke: Enables finger poking interactions.
   * 7: All: Supports all targeting modes (Direct, Indirect, and Poke).
   */
  @input
  @hint(
    "Defines how Interactors can target and interact with this Interactable. Options include:\n\
- Direct: Only allows close pinch interactions where a hand directly touches the Interactable.\n\
- Indirect: Allows interactions from a distance with raycasting.\n\
- Direct/Indirect: Supports both direct and indirect interaction methods.\n\
- Poke: Enables finger poking interactions.\n\
- All: Supports all targeting modes (Direct, Indirect, and Poke)."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Direct", 1),
      new ComboBoxItem("Indirect", 2),
      new ComboBoxItem("Direct/Indirect", 3),
      new ComboBoxItem("Poke", 4),
      new ComboBoxItem("All", 7)
    ])
  )
  targetingMode: number = 3

  /**
   * Enable this to allow the Interactable to instantly be dragged on trigger rather than obeying the Interactor's
   * drag threshold.
   */
  @input
  @hint(
    "Enable this to allow the Interactable to instantly be dragged on trigger rather than obeying the Interactor's \
drag threshold."
  )
  enableInstantDrag: boolean = false

  /**
   * A flag that enables scroll interactions when this element is interacted with. When true, interactions with this
   * element can scroll a parent ScrollView that has content extending beyond its visible bounds.
   */
  @input
  @hint(
    "A flag that enables scroll interactions when this element is interacted with. When true, interactions with this \
element can scroll a parent ScrollView that has content extending beyond its visible bounds."
  )
  isScrollable: boolean = false

  /**
   * Determines whether this Interactable can be simultaneously controlled by multiple Interactors. When false, only
   * one Interactor type (e.g., left hand or right hand) can interact with this Interactable at a time, and subsequent
   * interaction attempts from different Interactors will be blocked. Set to true to enable interactions from multiple
   * sources simultaneously, such as allowing both hands to manipulate the Interactable at once.
   */
  @input
  @hint(
    "Determines whether this Interactable can be simultaneously controlled by multiple Interactors. When false, only \
one Interactor type (e.g., left hand or right hand) can interact with this Interactable at a time, and subsequent \
interaction attempts from different Interactors will be blocked. Set to true to enable interactions from multiple \
sources simultaneously, such as allowing both hands to manipulate the Interactable at once."
  )
  allowMultipleInteractors: boolean = true

  /**
   * Enable Poke Directionality to help prevent accidental interactions when users approach from unwanted angles.
   */
  @ui.separator
  @input
  @hint("Enable Poke Directionality to help prevent accidental interactions when users approach from unwanted angles.")
  enablePokeDirectionality: boolean = false

  /**
   * Controls from which directions a poke interaction can trigger this Interactable along the X-axis:
   * - Left: Finger must approach from -X direction.
   * - Right: Finger must approach from +X direction.
   * - All: Accepts both directions.
   * - None: Disables X-axis poke detection.
   */
  @input
  @label("X")
  @showIf("enablePokeDirectionality")
  @hint(
    "Controls from which directions a poke interaction can trigger this Interactable along the X-axis:\n\
- Left: Finger must approach from -X direction.\n\
- Right: Finger must approach from +X direction.\n\
- All: Accepts both directions.\n\
- None: Disables X-axis poke detection."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("None", 0),
      new ComboBoxItem("Right", 1),
      new ComboBoxItem("Left", 2),
      new ComboBoxItem("All", 3)
    ])
  )
  acceptableXDirections: number = 0

  /**
   * Controls from which directions a poke interaction can trigger this Interactable along the Y-axis:
   * - Top: Finger must approach from +Y direction
   * - Bottom: Finger must approach from -Y direction
   * - All: Accepts both directions
   * - None: Disables Y-axis poke detection
   */
  @input
  @label("Y")
  @showIf("enablePokeDirectionality")
  @hint(
    "Controls from which directions a poke interaction can trigger this Interactable along the Y-axis:\n\
- Top: Finger must approach from +Y direction.\n\
- Bottom: Finger must approach from -Y direction.\n\
- All: Accepts both directions.\n\
- None: Disables Y-axis poke detection."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("None", 0),
      new ComboBoxItem("Top", 1),
      new ComboBoxItem("Bottom", 2),
      new ComboBoxItem("All", 3)
    ])
  )
  acceptableYDirections: number = 0

  /**
   * Controls from which directions a poke interaction can trigger this Interactable along the Z-axis:
   * - Front: Finger must approach from +Z direction.
   * - Back: Finger must approach from -Z direction.
   * - All: Accepts both directions.
   * - None: Disables Z-axis poke detection.
   */
  @input
  @label("Z")
  @showIf("enablePokeDirectionality")
  @hint(
    "Controls from which directions a poke interaction can trigger this Interactable along the Z-axis:\n\
- Front: Finger must approach from +Z direction.\n\
- Back: Finger must approach from -Z direction.\n\
- All: Accepts both directions.\n\
- None: Disables Z-axis poke detection."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("None", 0),
      new ComboBoxItem("Front", 1),
      new ComboBoxItem("Back", 2),
      new ComboBoxItem("All", 3)
    ])
  )
  acceptableZDirections: number = 1

  /**
   * Determines if the Interactable should listen to filtered pinch events when targeted by a HandInteractor.
   * Filtered pinch events are more stable when the hand is quickly moving but may add latency in non-moving cases.
   * Most interactions should use raw pinch events by default.
   * Spatial interactions with large hand movement (such as dragging, scrolling) should use filtered pinch events.
   * If an Interactable has a parent Interactable that uses filtered pinch events,
   * the Interactable will also use filtered pinch events.
   */
  @input
  @hint(
    "Determines if the Interactable should listen to filtered pinch events when targeted by a HandInteractor. \
Filtered pinch events are more stable when the hand is quickly moving but may add latency in non-moving cases. \
Most interactions should use raw pinch events by default. \
Spatial interactions with large hand movement (such as dragging, scrolling) should use filtered pinch events. \
If an Interactable has a parent Interactable that uses filtered pinch events, \
the Interactable will also use filtered pinch events."
  )
  useFilteredPinch: boolean = false

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * If set to true on the same frame as creating the Interactable component,
   * events targeting this Interactable will be propagated to other connections in the same lens.
   */
  @ui.separator
  @ui.group_start("Sync Kit Support")
  @input
  @hint(
    "Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. \
  If set to true on the same frame as creating the Interactable component, events targeting this Interactable \
  will be propagated to other users in the same Connected Lenses session using SyncKit's SyncInteractionManager."
  )
  public isSynced: boolean = false

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * If set to SyncInteractionType.All, any user connected to the session can interact with this Interactable.
   * If set to SyncInteraction.Host, only the session host can interact with this Interactable.
   * If set to SyncInteraction.Local, only the local user can interact with this Interactable.
   * Make sure to programmatically define the local user by setting interactable.localConnectionId to the user's connection ID.
   * If set to SyncInteraction.HostAndLocal, both the host and local user can interact with this Interactable.
   */
  @input
  @showIf("isSynced", true)
  @hint(
    "Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. \
If set to SyncInteractionType.All, any user connected to the session can interact with this Interactable. \
If set to SyncInteraction.Host, only the session host can interact with this Interactable. \
If set to SyncInteraction.Local, only the local user can interact with this Interactable. \
Make sure to programmatically define the local user by setting Interactable.localConnectionId to the user's connection ID. \
If set to SyncInteraction.HostAndLocal, both the host and local user can interact with this Interactable. \
The Interactable's localConnectionId must be programmatically set by the developer."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("All", 7),
      new ComboBoxItem("Host", 1),
      new ComboBoxItem("Local", 2),
      new ComboBoxItem("Host and Local", 3)
    ])
  )
  public acceptableSyncInteractionTypes: number = 7
  @ui.group_end

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * The local connection ID of the user that can interact with this Interactable.
   * Null if there is no particular user for this Interactable or if the lens is not connected.
   * If null during a session, make sure that Interactable.acceptableSyncInteractionTypes = SyncInteractionType.All.
   */
  public localConnectionId: string | null = null

  onAwake(): void {
    this.createEvent("OnDestroyEvent").bind(() => this.release())
    this.createEvent("OnEnableEvent").bind(() => {
      this.enableColliders(true)
    })
    this.createEvent("OnDisableEvent").bind(() => {
      this.enableColliders(false)
    })

    InteractionManager.getInstance().registerInteractable(this)
  }
  release(): void {
    InteractionManager.getInstance().deregisterInteractable(this)
  }

  /**
   * Notifies the interactable that it is entering hover state
   * @param eventArgs - the interactor that is driving the event {@link Interactor}
   */
  hoverEnter = (eventArgs: InteractableEventArgs): void => {
    if (this._hoveringInteractor === InteractorInputType.None) {
      this.onHoverEnterEvent.invoke({
        ...eventArgs,
        interactable: this
      })
      this.log.v("InteractionEvent : " + "On Hover Enter Event")
    }
    this._hoveringInteractor |= eventArgs.interactor.inputType
    this.onInteractorHoverEnterEvent.invoke({
      ...eventArgs,
      interactable: this
    })
    this.log.v("InteractionEvent : " + "On Interactor Hover Enter Event")
  }

  /**
   * Notifies the interactable that it is still hovering
   * @param eventArgs - event parameters, with omitted interactable
   */
  hoverUpdate = (eventArgs: InteractableEventArgs): void => {
    if (this._hoveringInteractor === InteractorInputType.None) {
      return
    }
    this.onHoverUpdateEvent.invoke({
      ...eventArgs,
      interactable: this
    })
  }

  /**
   * Notifies the interactable that it is exiting hover state
   * @param eventArgs - event parameters, with omitted interactable
   */
  hoverExit = (eventArgs: InteractableEventArgs): void => {
    this._hoveringInteractor &= ~eventArgs.interactor.inputType
    this.onInteractorHoverExitEvent.invoke({
      ...eventArgs,
      interactable: this
    })
    this.log.v("InteractionEvent : " + "On Interactor Hover Exit Event")

    if (this._hoveringInteractor === InteractorInputType.None) {
      this.onHoverExitEvent.invoke({
        ...eventArgs,
        interactable: this
      })
      this.log.v("InteractionEvent : " + "On Hover Exit Event")
    }
  }

  /**
   * Notifies the interactable that it is entering trigger state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerStart = (eventArgs: InteractableEventArgs): void => {
    if (this._triggeringInteractor === InteractorInputType.None) {
      this.onTriggerStartEvent.invoke({
        ...eventArgs,
        interactable: this
      })
      this.log.v("InteractionEvent : " + "On Trigger Start Event")
    }

    this._triggeringInteractor |= eventArgs.interactor.inputType
    this.onInteractorTriggerStartEvent.invoke({
      ...eventArgs,
      interactable: this
    })
    this.log.v("InteractionEvent : " + "On Interactor Trigger Start Event")
  }

  /**
   * Notifies the interactable that it is still in a triggering state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerUpdate = (eventArgs: InteractableEventArgs): void => {
    this.onTriggerUpdateEvent.invoke({
      ...eventArgs,
      interactable: this
    })
    this.dragStartOrUpdate(eventArgs)
  }

  /**
   * Notifies the interactable that it is exiting trigger state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerEnd = (eventArgs: InteractableEventArgs): void => {
    this._triggeringInteractor &= ~eventArgs.interactor.inputType
    this.onInteractorTriggerEndEvent.invoke({
      ...eventArgs,
      interactable: this
    })
    this.log.v("InteractionEvent : " + "On Interactor Trigger End Event")

    if (this._triggeringInteractor === InteractorInputType.None) {
      this.onTriggerEndEvent.invoke({
        ...eventArgs,
        interactable: this
      })
      this.log.v("InteractionEvent : " + "On Trigger End Event")
    }
    this.dragEnd(eventArgs)
  }

  /**
   * Notifies the interactable that it is a cancelled state with the interactor
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerCanceled = (eventArgs: InteractableEventArgs): void => {
    this._triggeringInteractor = InteractorInputType.None
    this.onTriggerCanceledEvent.invoke({
      ...eventArgs,
      interactable: this
    })
    this.log.v("InteractionEvent : " + "On Trigger Canceled Event")
    this.dragEnd(eventArgs)
  }

  /**
   * Interactors that are hovering this interactable
   */
  get hoveringInteractor(): InteractorInputType {
    return this._hoveringInteractor
  }

  /**
   * Interactors that are triggering this interactable
   */
  get triggeringInteractor(): InteractorInputType {
    return this._triggeringInteractor
  }

  /**
   * Notifies the interactable that it is in a dragged state with the interactor
   * @param eventArgs - event parameters, with omitted interactable
   */
  dragStartOrUpdate(eventArgs: InteractableEventArgs) {
    const currentDragVector = eventArgs.interactor.currentDragVector
    if (currentDragVector === null) {
      return
    }

    const previousDragVector = eventArgs.interactor.previousDragVector
    const dragInteractorEvent = {
      ...eventArgs,
      interactable: this,
      dragVector: currentDragVector,
      planecastDragVector: eventArgs.interactor.planecastDragVector
    }

    if (previousDragVector === null) {
      this.onDragStartEvent.invoke(dragInteractorEvent)
      this.log.v("InteractionEvent : " + "On Drag Start Event")
    } else {
      this.onDragUpdateEvent.invoke(dragInteractorEvent)
    }
  }

  /**
   * Notifies the interactable that it is exiting a dragged state with the interactor
   * @param eventArgs - event parameters, with omitted interactable
   */
  dragEnd(eventArgs: InteractableEventArgs) {
    const previousDragVector = eventArgs.interactor.previousDragVector
    if (previousDragVector === null) {
      return
    }

    this.onDragEndEvent.invoke({
      ...eventArgs,
      interactable: this,
      dragVector: previousDragVector,
      planecastDragVector: eventArgs.interactor.planecastDragVector
    })
    this.log.v("InteractionEvent : " + "On Drag End Event")
  }

  private enableColliders(enable: boolean) {
    for (let i = 0; i < this.colliders.length; i++) {
      this.colliders[i].enabled = enable
    }
  }
}
