import React, { useState, useEffect, useRef } from "react";
import "./app.css";

// Declare SpeechRecognition type for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof window.SpeechRecognition;
    webkitSpeechRecognition: typeof window.SpeechRecognition;
  }
}

type GlobalSpeechRecognition = {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
};

type SpeechRecognition = GlobalSpeechRecognition; // Alias for compatibility

// Use the native SpeechRecognitionEvent type provided by TypeScript
type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

let nextTaskId = 7;
let nextNoteId = 1;

type Task = { id: number; text: string; dueDate?: string };
type Note = { id: number; text: string };

const initialTasks: Task[] = [
  { id: 1, text: "Task 1" },
  { id: 2, text: "Task 2" },
  { id: 3, text: "Task 3" },
  { id: 4, text: "Task 4" },
];

const suggestedTasks: Task[] = [
  { id: 5, text: "Suggested Task 1" },
  { id: 6, text: "Suggested Task 2" },
];

const initialNotes: Note[] = [];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          const lowerTranscript = finalTranscript.toLowerCase().trim();
          
          // Check for wake word "hey snap"
          if (lowerTranscript.includes('hey snap')) {
            const command = lowerTranscript.replace('hey snap', '').trim();
            
            if (command.includes('add task') || command.includes('new task') || command.includes('task')) {
              const taskText = command.replace(/add task|new task|task/, '').trim() || 'Voice Task';
              const newTask: Task = {
                id: nextTaskId++,
                text: taskText,
              };
              setTasks((prevTasks) => [...prevTasks, newTask]);
            } else if (command.includes('add note') || command.includes('new note') || command.includes('note')) {
              const noteText = command.replace(/add note|new note|note/, '').trim() || 'Voice Note';
              const newNote: Note = {
                id: nextNoteId++,
                text: noteText,
              };
              setNotes((prevNotes) => [...prevNotes, newNote]);
            } else if (command) {
              // Default to adding as a task if no specific command
              const newTask: Task = {
                id: nextTaskId++,
                text: command,
              };
              setTasks((prevTasks) => [...prevTasks, newTask]);
            }
          }
          
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: nextTaskId++,
      text: `New Task ${nextTaskId - 1}`,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: nextNoteId++,
      text: `New Note ${nextNoteId - 1}`,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleAddRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="container">
      {/* Speech Status */}
      {isListening && (
        <div className="speech-status">
          🎤 Listening for "Hey Snap"... Say: "Hey Snap add task [task name]" or "Hey Snap add note [note text]"
        </div>
      )}
      
      <div className="main-content">
        {/* Left - Tasks */}
        <div className="sidebar">
          <div className="header-row">
            <button onClick={handleAddTask} className="add-button">
              ➕
            </button>
            <h3>📋 Tasks</h3>
          </div>
          <ul className="list">
            {tasks.map((task) => (
              <li key={task.id} className="list-item">
                {task.text}
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
          <button 
            onClick={handleAddRecording} 
            className={`voice-button ${isListening ? 'listening' : ''}`}
          >
            {isListening ? '🔴 Stop' : '🎤 Voice'}
          </button>
        </div>

        {/* Right - Notes */}
        <div className="sidebar">
          <div className="header-row">
            <button onClick={handleAddNote} className="add-button">
              ➕
            </button>
            <button onClick={handleAddRecording} className="add-button">
              {isListening ? '🔴' : '🗣️'}
            </button>
            <h3>📝 Notes</h3>
          </div>
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
