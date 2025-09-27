"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
require("./app.css");
var initialTasks = [
    { id: 1, text: "Task 1" },
    { id: 2, text: "Task 2" },
    { id: 3, text: "Task 3" },
    { id: 4, text: "Task 4" },
];
var suggestedTasks = [
    { id: 5, text: "Task 1" },
    { id: 6, text: "Task 2" },
];
var notes = [
    { id: 1, text: "Note #1" },
    { id: 2, text: "Recording #1" },
];
function App() {
    var _a = react_1.useState(initialTasks), tasks = _a[0], setTasks = _a[1];
    var _b = react_1.useState(false), isListening = _b[0], setIsListening = _b[1];
    var _c = react_1.useState(false), isRecording = _c[0], setIsRecording = _c[1];
    var _d = react_1.useState("Listening for 'Hey Google'..."), status = _d[0], setStatus = _d[1];
    var _e = react_1.useState(false), showDatePicker = _e[0], setShowDatePicker = _e[1];
    var _f = react_1.useState(null), pendingTaskId = _f[0], setPendingTaskId = _f[1];
    var recognitionRef = react_1.useRef(null);
    var silenceTimerRef = react_1.useRef(null);
    var taskIdRef = react_1.useRef(7);
    // Generate date options for the next 30 days
    var generateDateOptions = function () {
        var dates = [];
        var today = new Date();
        for (var i = 0; i < 30; i++) {
            var date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                value: date.toISOString().split('T')[0],
                label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                })
            });
        }
        return dates;
    };
    var dateOptions = generateDateOptions();
    var handleDateSelect = function (dateValue) {
        if (pendingTaskId) {
            setTasks(function (prev) { return prev.map(function (task) {
                return task.id === pendingTaskId
                    ? __assign(__assign({}, task), { dueDate: dateValue }) : task;
            }); });
        }
        setShowDatePicker(false);
        setPendingTaskId(null);
        setStatus("✅ Due date set! Listening for 'Hey Google'...");
    };
    var skipDueDate = function () {
        setShowDatePicker(false);
        setPendingTaskId(null);
        setStatus("✅ Task added without due date! Listening for 'Hey Google'...");
    };
    react_1.useEffect(function () {
        // Check if speech recognition is supported
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatus("Speech recognition not supported in this browser");
            return;
        }
        var recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onstart = function () {
            setIsListening(true);
        };
        recognition.onresult = function (event) {
            var lastResult = event.results[event.results.length - 1];
            var transcript = lastResult[0].transcript.toLowerCase().trim();
            if (!isRecording) {
                // Listen for wake phrase
                if (transcript.includes('hey google')) {
                    setIsRecording(true);
                    setStatus("🔴 Recording... (will stop after 3 seconds of silence)");
                    // Clear any existing timer
                    if (silenceTimerRef.current) {
                        window.clearTimeout(silenceTimerRef.current);
                    }
                }
            }
            else {
                // Recording mode - capture the task
                var taskText = transcript.replace(/hey google/gi, '').trim();
                if (taskText && lastResult.isFinal) {
                    // Add the task
                    var newTask_1 = {
                        id: taskIdRef.current++,
                        text: taskText
                    };
                    setTasks(function (prev) { return __spreadArrays(prev, [newTask_1]); });
                    setIsRecording(false);
                    // Show date picker for the new task
                    setPendingTaskId(newTask_1.id);
                    setShowDatePicker(true);
                    setStatus("📅 Task added! Select a due date or skip:");
                    // Clear silence timer
                    if (silenceTimerRef.current) {
                        window.clearTimeout(silenceTimerRef.current);
                    }
                }
                // Reset silence timer
                if (silenceTimerRef.current) {
                    window.clearTimeout(silenceTimerRef.current);
                }
                silenceTimerRef.current = window.setTimeout(function () {
                    if (isRecording) {
                        setIsRecording(false);
                        setStatus("⏰ Stopped recording (silence timeout). Listening for 'Hey Google'...");
                    }
                }, 3000);
            }
        };
        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
            setStatus("Error: " + event.error + ". Listening for 'Hey Google'...");
        };
        recognition.onend = function () {
            // Restart recognition to keep it continuous
            if (recognitionRef.current && !showDatePicker) {
                setTimeout(function () {
                    var _a;
                    try {
                        (_a = recognitionRef.current) === null || _a === void 0 ? void 0 : _a.start();
                    }
                    catch (error) {
                        console.log('Recognition restart prevented:', error);
                    }
                }, 100);
            }
        };
        recognitionRef.current = recognition;
        // Start listening only if date picker is not shown
        if (!showDatePicker) {
            try {
                recognition.start();
            }
            catch (error) {
                setStatus("Error starting speech recognition");
            }
        }
        // Cleanup
        return function () {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (silenceTimerRef.current) {
                window.clearTimeout(silenceTimerRef.current);
            }
        };
    }, [isRecording, showDatePicker]);
    return (react_1["default"].createElement("div", { className: "container" },
        react_1["default"].createElement("div", { className: "speech-status" },
            react_1["default"].createElement("div", { className: "status-indicator " + (isListening ? 'listening' : '') + " " + (isRecording ? 'recording' : '') }, isRecording ? '🔴' : isListening ? '🎤' : '❌'),
            react_1["default"].createElement("span", null, status)),
        showDatePicker && (react_1["default"].createElement("div", { className: "date-picker-modal" },
            react_1["default"].createElement("div", { className: "date-picker-content" },
                react_1["default"].createElement("h3", null, "\uD83D\uDCC5 Set Due Date"),
                react_1["default"].createElement("div", { className: "date-picker-scroll" }, dateOptions.map(function (date) { return (react_1["default"].createElement("button", { key: date.value, className: "date-option", onClick: function () { return handleDateSelect(date.value); } }, date.label)); })),
                react_1["default"].createElement("div", { className: "date-picker-actions" },
                    react_1["default"].createElement("button", { className: "skip-button", onClick: skipDueDate }, "Skip Due Date"))))),
        react_1["default"].createElement("div", { className: "main-content" },
            react_1["default"].createElement("div", { className: "sidebar" },
                react_1["default"].createElement("h3", null, "\uD83D\uDCCB Tasks \u2795"),
                react_1["default"].createElement("ul", { className: "list" }, tasks.map(function (task) { return (react_1["default"].createElement("li", { key: task.id, className: "list-item" },
                    react_1["default"].createElement("div", { className: "task-content" },
                        react_1["default"].createElement("span", { className: "task-text" }, task.text),
                        task.dueDate && (react_1["default"].createElement("span", { className: "due-date" },
                            "\uD83D\uDCC5 ",
                            new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })))))); })),
                react_1["default"].createElement("h4", null, "Suggested Tasks"),
                react_1["default"].createElement("ul", { className: "list" }, suggestedTasks.map(function (task) { return (react_1["default"].createElement("li", { key: task.id, className: "list-item" }, task.text)); }))),
            react_1["default"].createElement("div", { className: "center" },
                react_1["default"].createElement("button", { className: "home-button" }, "Home")),
            react_1["default"].createElement("div", { className: "sidebar" },
                react_1["default"].createElement("h3", null, "\uD83D\uDCDD Notes \u2B07"),
                react_1["default"].createElement("ul", { className: "list" }, notes.map(function (note) { return (react_1["default"].createElement("li", { key: note.id, className: "list-item" }, note.text)); }))))));
}
exports["default"] = App;
