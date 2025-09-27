

// @input Component.ScriptComponent controller
// @input bool showLogs

const controller = script.controller;
const showLogs = script.showLogs;

const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;
const InteractableManipulation = require("SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation").InteractableManipulation;

let sceneObj;
let syncEntity;
let isTurnFinished;

function finishTurn() {
    if (!isTurnFinished) {
        // Piece was moved, tell controller that my turn is complete   
        controller.finishTurn();
        isTurnFinished = true;
        if (showLogs) {
            print(sceneObj.name + " moved, turn finished");
        }
    }   
}

function onReady() {
    if (showLogs) {
        print("Sync entity is ready");    
    }
    
    // Get SIK manipulatable component
    let manipulatable = sceneObj.getComponent(InteractableManipulation);
    
    if (syncEntity.networkRoot.locallyCreated) {
        // Piece belongs to me, I can move it
        manipulatable.setCanTranslate(true);
        manipulatable.onManipulationEnd.add(finishTurn);
    } else {
        // Piece belongs to other player, I can't move it
        manipulatable.setCanTranslate(false);
    }
}

function init() { 
    
    sceneObj = script.getSceneObject();
    
    // Get sync entity for SyncTransform script
    syncEntity = SyncEntity.getSyncEntityOnSceneObject(sceneObj);
    
    // Check sync entity is ready before using it
    syncEntity.notifyOnReady(onReady);
    
    if (showLogs) {
        print("Initialized " + sceneObj.name);    
    }
}

// Run if JavaScript version is enabled
if (controller.getSceneObject().enabled) {
    init();
}