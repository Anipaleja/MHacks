// @input Component.ScriptComponent instantiator
// @input Asset.ObjectPrefab xPrefab
// @input Asset.ObjectPrefab oPrefab;
// @input bool showLogs

const instantiator = script.instantiator;
const xPrefab = script.xPrefab;
const oPrefab = script.oPrefab;
const showLogs = script.showLogs;

const MAX_TURNS = 9;

let syncEntity;
let turnsProp;
let player;
let isGameOver;

// Script API

function finishTurn() {
    // Increment the turns property    
    let turnsCount = turnsProp.currentValue + 1;
    turnsProp.setPendingValue(turnsCount);
}

script.finishTurn = finishTurn;

// Synced Callbacks

function onReady() {
    if (showLogs) {
        print("Session is ready");    
    }
    
    const playerCount = global.sessionController.getUsers().length;
    
    // Assign pieces to users
    // The first player is X, the second is O, everyone else is a spectator
    if (playerCount === 1) {
        player = "X";
    } else if (playerCount === 2) {
        player = "O";
    } else {
        player = "";
    }
    
    // If O is assigned, send event to start the game
    if (player === "O") {
        syncEntity.sendEvent("start");
    }
    
}

function setTurn(newCount, oldCount) {
    // No player has completed a turn yet, don't do anything
    if (newCount === 0) return;
    
    // The maximum number of turns have been played, the game is over
    if (newCount === MAX_TURNS) {
        isGameOver = true;
        if (showLogs) {
            print("Game is over!");
        }
        return;
    }
    
    // Check whose turn it is and spawn their piece
    if (newCount % 2 === 0 && player === "X") {
        spawn(xPrefab);
    } else if (newCount % 2 === 1 && player === "O") {
        spawn(oPrefab);
    }
    
}

function spawn(prefab) {
    if (showLogs) {
        print("Spawning " + prefab.name);   
    }
    
    if (instantiator.isReady()) {
        // Spawn piece using the Sync Framework instantiator, set local start position
        const options = new InstantiationOptions();
        options.localPosition = new vec3(0,-25,0);
        instantiator.instantiate(prefab, options);
    }
}

function start() {
    if (showLogs) {
        print("Start");    
    }
    
    // Player X spawns first piece to start the game
    if (player === "X") {
        spawn(xPrefab);
    }
}

// Initialize

function init() {
    
    // Create new sync entity for this script
    syncEntity = new SyncEntity(script);
    
    // Add networked event to start the game
    syncEntity.onEventReceived.add("start", start);
    
    // Use storage property to keep track of turns, used to figure out whose turn it is
    turnsProp = StorageProperty.manualInt("turnsCount", 0);
    syncEntity.addStorageProperty(turnsProp);
    turnsProp.onAnyChange.add(setTurn);
    
    // Set up the sync entity notify on ready callback
    // Note: Only update the sync entity once it is ready
    syncEntity.notifyOnReady(onReady);  
    
    isGameOver = false;

    if (showLogs) {
        print("Initialized");    
    }
}

// Initialize on start to make sure Spectacles Interaction Kit (SIK) is ready to use
script.createEvent("OnStartEvent").bind(init);