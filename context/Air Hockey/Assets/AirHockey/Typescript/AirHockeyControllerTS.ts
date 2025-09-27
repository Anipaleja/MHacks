import { AirHockeyPaddle } from "./AirHockeyPaddleTS";
import { AirHockeyPuck } from "./AirHockeyPuckTS";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { SessionController } from "SpectaclesSyncKit.lspkg/Core/SessionController";
import { StorageProperty } from "SpectaclesSyncKit.lspkg/Core/StorageProperty";
import { SyncEntity } from "SpectaclesSyncKit.lspkg/Core/SyncEntity";

@component
export class AirHockeyController extends BaseScriptComponent {
  @input
  controllerJS: ScriptComponent;

  @input()
  puck: AirHockeyPuck;

  @input()
  leftGoalCollider: ColliderComponent;

  @input()
  rightGoalCollider: ColliderComponent;

  @input()
  leftPaddle: AirHockeyPaddle;

  @input()
  leftPaddleInteractable: Interactable;

  @input()
  leftPaddleManipulation: InteractableManipulation;

  @input()
  rightPaddle: AirHockeyPaddle;

  @input()
  rightPaddleInteractable: Interactable;

  @input()
  rightPaddleManipulation: InteractableManipulation;

  @input()
  startGameButton: PinchButton;

  @input()
  leftScore1: Text;

  @input
  rightScore1: Text;

  @input()
  leftScore2: Text;

  @input()
  rightScore2: Text;

  isLeftPlayer: boolean = false;
  isRightPlayer: boolean = false;
  hasInitAsOwner: boolean = false;
  syncEntity: SyncEntity;
  sessionController: SessionController = SessionController.getInstance();

  private isGameStartedProp = StorageProperty.manualBool(
    "isGameStarted",
    false
  );
  private leftScoreProp = StorageProperty.manualInt("leftScore", 0);
  private rightScoreProp = StorageProperty.manualInt("rightScore", 0);

  initAsClient() {
    this.refreshUI();
  }

  initAsOwner() {
    if (this.hasInitAsOwner) return;

    this.hasInitAsOwner = true;

    this.leftGoalCollider.onOverlapEnter.add((e) => this.onLeftGoalOverlap(e));
    this.rightGoalCollider.onOverlapEnter.add((e) =>
      this.onRightGoalOverlap(e)
    );
    this.startGameButton.onButtonPinched.add(() => this.startGame());

    print("Trying to claim ownership of puck");
    this.puck.syncEntity.tryClaimOwnership(() => this.refreshUI());

    this.refreshUI();
  }

  isHost() {
    return this.syncEntity.isSetupFinished && this.syncEntity.doIOwnStore();
  }

  joinLeft() {
    if (
      !this.isLeftPlayer &&
      !this.isRightPlayer &&
      !this.leftPaddle.syncEntity.isStoreOwned()
    ) {
      this.setupForLeftSide();
    }
  }

  joinRight() {
    if (
      !this.isLeftPlayer &&
      !this.isRightPlayer &&
      !this.rightPaddle.syncEntity.isStoreOwned()
    ) {
      this.setupForRightSide();
    }
  }

  refreshUI() {
    const isConnected: boolean = this.syncEntity.isSetupFinished;
    this.startGameButton.getSceneObject().enabled =
      isConnected &&
      this.isHost() &&
      !this.isGameStartedProp.currentOrPendingValue &&
      this.puck.syncEntity.doIOwnStore();
  }

  setLeftScore(newScore: number, oldScore: number) {
    this.leftScore1.text = "" + newScore;
    this.leftScore2.text = "" + newScore;
  }

  setRightScore(newScore: number, oldScore: number) {
    this.rightScore1.text = "" + newScore;
    this.rightScore2.text = "" + newScore;
  }

  setupForLeftSide() {
    this.leftPaddle.syncEntity.tryClaimOwnership(() => {
      this.isLeftPlayer = true;
      this.leftPaddleManipulation.setCanTranslate(true);
      this.refreshUI();
    });
  }

  setupForRightSide() {
    this.rightPaddle.syncEntity.tryClaimOwnership(() => {
      this.isRightPlayer = true;
      this.rightPaddleManipulation.setCanTranslate(true);
      this.refreshUI();
    });
  }

  startGame() {
    print("Start button pinched");
    if (!this.isGameStartedProp.currentOrPendingValue) {
      this.isGameStartedProp.setValueImmediate(
        this.syncEntity.currentStore,
        true
      );
      this.refreshUI();
      print("Start game");
      this.puck.startMovement();
    }
  }

  onLeftGoalOverlap(eventArgs) {
    const overlap = eventArgs.overlap;
    if (overlap.collider.isSame(this.puck.body)) {
      print("Goal on left!");
      this.puck.resetPuck();
      this.rightScoreProp.setPendingValue(
        this.rightScoreProp.currentOrPendingValue + 1
      );
    }
  }

  onRightGoalOverlap(eventArgs) {
    const overlap = eventArgs.overlap;
    if (overlap.collider.isSame(this.puck.body)) {
      print("Goal on right!");
      this.puck.resetPuck();
      this.leftScoreProp.setPendingValue(
        this.leftScoreProp.currentOrPendingValue + 1
      );
    }
  }

  onSyncEntityReady() {
    print("Sync entity ready");

    if (this.isHost()) {
      this.initAsOwner();
    } else {
      this.initAsClient();
    }

    this.leftPaddleInteractable.onHoverEnter.add(() => this.joinLeft());
    this.rightPaddleInteractable.onHoverEnter.add(() => this.joinRight());

    this.leftPaddle.syncEntity.onOwnerUpdated.add(() => {
      print("Left paddle owner updated");
      this.refreshUI();
    });
    this.rightPaddle.syncEntity.onOwnerUpdated.add(() => {
      print("Right paddle owner updated");
      this.refreshUI();
    });
    this.puck.syncEntity.onOwnerUpdated.add(() => {
      print("Puck owner updated");
      this.refreshUI();
    });

    this.refreshUI();
  }

  onOwnershipUpdated() {
    if (!this.syncEntity.isStoreOwned()) {
      print("Controller is not owned, trying to claim");
      this.syncEntity.tryClaimOwnership(() => this.initAsOwner());
    }
    this.refreshUI();
  }

  onSessionReady() {
    print("Session ready");

    this.leftPaddleManipulation.setCanTranslate(false);
    this.leftPaddleManipulation.setCanScale(false);
    this.leftPaddleManipulation.setCanRotate(false);

    this.rightPaddleManipulation.setCanTranslate(false);
    this.rightPaddleManipulation.setCanScale(false);
    this.rightPaddleManipulation.setCanRotate(false);

    this.syncEntity = new SyncEntity(this, null, true);
    this.syncEntity.addStorageProperty(this.isGameStartedProp);
    this.syncEntity.addStorageProperty(this.leftScoreProp);
    this.syncEntity.addStorageProperty(this.rightScoreProp);

    this.leftScoreProp.onAnyChange.add((newScore: number, oldScore: number) =>
      this.setLeftScore(newScore, oldScore)
    );
    this.rightScoreProp.onAnyChange.add((newScore: number, oldScore: number) =>
      this.setRightScore(newScore, oldScore)
    );

    this.syncEntity.notifyOnReady(() => this.onSyncEntityReady());
    this.syncEntity.onOwnerUpdated.add(() => this.onOwnershipUpdated());
  }

  onStart() {
    this.sessionController.notifyOnReady(() => this.onSessionReady());
  }

  onAwake() {
    if (this.controllerJS.getSceneObject().enabled) {
      print("Javascript controller is enabled, skipping initialization");
      return;
    }

    this.createEvent("OnStartEvent").bind(() => this.onStart());
  }
}
