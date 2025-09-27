import React, { useState, useEffect, useRef } from "react";
import "./app.css";

type Task = { id: number; text: string; dueDate?: string };
type Note = { id: number; text: string };

const initialTasks: Task[] = [
  { id: 1, text: "Task 1" },
  { id: 2, text: "Task 2" },
  { id: 3, text: "Task 3" },
  { id: 4, text: "Task 4" },
];

const suggestedTasks: Task[] = [
  { id: 5, text: "Task 1" },
  { id: 6, text: "Task 2" },
];

const notes: Note[] = [
  { id: 1, text: "Note #1" },
  { id: 2, text: "Recording #1" },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Listening for 'Hey Google'...");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const taskIdRef = useRef(7);

  // Generate date options for the next 30 days
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
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

  const dateOptions = generateDateOptions();

  const handleDateSelect = (dateValue: string) => {
    if (pendingTaskId) {
      setTasks(prev => prev.map(task =>
        task.id === pendingTaskId
          ? { ...task, dueDate: dateValue }
          : task
      ));
    }
    setShowDatePicker(false);
    setPendingTaskId(null);
    setStatus("✅ Due date set! Listening for 'Hey Google'...");
  };

  const skipDueDate = () => {
    setShowDatePicker(false);
    setPendingTaskId(null);
    setStatus("✅ Task added without due date! Listening for 'Hey Google'...");
  };

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript.toLowerCase().trim();

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
      } else {
        // Recording mode - capture the task
        const taskText = transcript.replace(/hey google/gi, '').trim();

        if (taskText && lastResult.isFinal) {
          // Add the task
          const newTask: Task = {
            id: taskIdRef.current++,
            text: taskText
          };

          setTasks(prev => [...prev, newTask]);
          setIsRecording(false);

          // Show date picker for the new task
          setPendingTaskId(newTask.id);
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

        silenceTimerRef.current = window.setTimeout(() => {
          if (isRecording) {
            setIsRecording(false);
            setStatus("⏰ Stopped recording (silence timeout). Listening for 'Hey Google'...");
          }
        }, 3000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setStatus(`Error: ${event.error}. Listening for 'Hey Google'...`);
    };

    recognition.onend = () => {
      // Restart recognition to keep it continuous
      if (recognitionRef.current && !showDatePicker) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (error) {
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
      } catch (error) {
        setStatus("Error starting speech recognition");
      }
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isRecording, showDatePicker]);

  return (
    <div className="container">
      {/* Speech Status */}
      <div className="speech-status">
        <div className={`status-indicator ${isListening ? 'listening' : ''} ${isRecording ? 'recording' : ''}`}>
          {isRecording ? '🔴' : isListening ? '🎤' : '❌'}
        </div>
        <span>{status}</span>
      </div>

      {/* Due Date Picker Modal */}
      {showDatePicker && (
        <div className="date-picker-modal">
          <div className="date-picker-content">
            <h3>📅 Set Due Date</h3>
            <div className="date-picker-scroll">
              {dateOptions.map((date) => (
                <button
                  key={date.value}
                  className="date-option"
                  onClick={() => handleDateSelect(date.value)}
                >
                  {date.label}
                </button>
              ))}
            </div>
            <div className="date-picker-actions">
              <button className="skip-button" onClick={skipDueDate}>
                Skip Due Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Left - Tasks */}
        <div className="sidebar">
          <h3>📋 Tasks ➕</h3>
          <ul className="list">
            {tasks.map((task) => (
              <li key={task.id} className="list-item">
                <div className="task-content">
                  <span className="task-text">{task.text}</span>
                  {task.dueDate && (
                    <span className="due-date">
                      📅 {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <h4>Suggested Tasks</h4>
          <ul className="list">
            {suggestedTasks.map((task) => (
              <li key={task.id} className="list-item">
                {task.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Middle - Home Button */}
        <div className="center">
          <button className="home-button">Home</button>
        </div>

        {/* Right - Notes */}
        <div className="sidebar">
          <h3>📝 Notes ⬇</h3>
          <ul className="list">
            {notes.map((note) => (
              <li key={note.id} className="list-item">
                {note.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}