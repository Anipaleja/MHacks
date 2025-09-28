"use strict";

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

exports.__esModule = true;

var react_1 = require("react");

require("./app.css");

var nextTaskId = 5;
var nextNoteId = 1;
var initialTasks = [{
  id: 1,
  text: "Task 1"
}, {
  id: 2,
  text: "Task 2"
}, {
  id: 3,
  text: "Task 3"
}, {
  id: 4,
  text: "Task 4"
}];
var suggestedTasks = [{
  id: 5,
  text: "Task 1"
}, {
  id: 6,
  text: "Task 2"
}];
var initialNotes = [];

function App() {
  // 1. Use useState to manage the list of tasks
  var _a = react_1.useState(initialNotes),
      notes = _a[0],
      setNotes = _a[1];

  var _b = react_1.useState(initialTasks),
      tasks = _b[0],
      setTasks = _b[1];

  var _c = react_1.useState(false),
      isListening = _c[0],
      setIsListening = _c[1];

  var _d = react_1.useState(""),
      transcript = _d[0],
      setTranscript = _d[1];

  var recognitionRef = react_1.useRef(null);
  react_1.useEffect(function () {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = function (event) {
        var finalTranscript = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          var lowerTranscript = finalTranscript.toLowerCase().trim(); // Check for wake word "hey snap"

          if (lowerTranscript.includes('hey snap')) {
            var command = lowerTranscript.replace('hey snap', '').trim();

            if (command.includes('add task') || command.includes('new task') || command.includes('task')) {
              var taskText = command.replace(/add task|new task|task/, '').trim() || 'Voice Task';
              var newTask_1 = {
                id: nextTaskId++,
                text: taskText
              };
              setTasks(function (prevTasks) {
                return __spreadArrays(prevTasks, [newTask_1]);
              });
            } else if (command.includes('add note') || command.includes('new note') || command.includes('note')) {
              var noteText = command.replace(/add note|new note|note/, '').trim() || 'Voice Note';
              var newNote_1 = {
                id: nextNoteId++,
                text: noteText
              };
              setNotes(function (prevNotes) {
                return __spreadArrays(prevNotes, [newNote_1]);
              });
            } else if (command) {
              // Default to adding as a task if no specific command
              var newTask_2 = {
                id: nextTaskId++,
                text: command
              };
              setTasks(function (prevTasks) {
                return __spreadArrays(prevTasks, [newTask_2]);
              });
            }
          }

          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = function () {
        setIsListening(false);
      };
    }

    return function () {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  var startListening = function startListening() {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  var stopListening = function stopListening() {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }; // 2. Function to add a new task


  var handleAddTask = function handleAddTask() {
    // Create a new task object
    var newTask = {
      id: nextTaskId++,
      text: "New Task " + (nextTaskId - 1)
    }; // Update the state with the new task appended

    setTasks(function (prevTasks) {
      return __spreadArrays(prevTasks, [newTask]);
    });
  };

  var handleAddNote = function handleAddNote() {
    var newNote = {
      id: nextNoteId++,
      text: "New Note " + (nextNoteId - 1)
    };
    setNotes(function (prevNotes) {
      return __spreadArrays(prevNotes, [newNote]);
    });
  };

  var handleAddRecording = function handleAddRecording() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return react_1["default"].createElement("div", {
    className: "container"
  }, isListening && react_1["default"].createElement("div", {
    className: "speech-status"
  }, "\uD83C\uDFA4 Listening for \"Hey Snap\"... Say: \"Hey Snap add task [task name]\" or \"Hey Snap add note [note text]\""), react_1["default"].createElement("div", {
    className: "sidebar"
  }, react_1["default"].createElement("div", {
    className: "header-row"
  }, react_1["default"].createElement("button", {
    onClick: handleAddTask,
    className: "add-button"
  }, "\u2795"), react_1["default"].createElement("h3", null, "\uD83D\uDCCB Tasks")), react_1["default"].createElement("ul", {
    className: "list"
  }, tasks.map(function (task) {
    return react_1["default"].createElement("li", {
      key: task.id,
      className: "list-item"
    }, task.text);
  })), react_1["default"].createElement("h4", null, "Suggested Tasks"), react_1["default"].createElement("ul", {
    className: "list"
  }, suggestedTasks.map(function (task) {
    return react_1["default"].createElement("li", {
      key: task.id,
      className: "list-item"
    }, task.text);
  }))), react_1["default"].createElement("div", {
    className: "center"
  }, react_1["default"].createElement("button", {
    className: "home-button"
  }, "Home"), react_1["default"].createElement("button", {
    onClick: handleAddRecording,
    className: "voice-button " + (isListening ? 'listening' : '')
  }, isListening ? '🔴 Stop' : '🎤 Voice')), react_1["default"].createElement("div", {
    className: "sidebar"
  }, react_1["default"].createElement("div", {
    className: "header-row"
  }, react_1["default"].createElement("button", {
    onClick: handleAddNote,
    className: "add-button"
  }, "\u2795"), react_1["default"].createElement("button", {
    onClick: handleAddRecording,
    className: "add-button"
  }, isListening ? '🔴' : '🗣️'), react_1["default"].createElement("h3", null, "\uD83D\uDCDD Notes")), react_1["default"].createElement("ul", {
    className: "list"
  }, notes.map(function (note) {
    return react_1["default"].createElement("li", {
      key: note.id,
      className: "list-item"
    }, note.text);
  }))));
}

exports["default"] = App;