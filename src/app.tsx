import React from "react";
import "./app.css";

let nextTaskId = 1;
let nextNoteId = 1;

type Task = { id: number; text: string; dueDate?: string };
type Note = { id: number; text: string };

const tasks: Task[] = [
  { id: 1, text: "Task 1" },
  { id: 2, text: "Task 2" },
  { id: 3, text: "Task 3" },
  { id: 4, text: "Task 4" },
];

const suggestedTasks: Task[] = [
  { id: 5, text: "Task 1" },
  { id: 6, text: "Task 2" },
];

const initialNotes: Note[] = [];

export default function App() {
<<<<<<< HEAD
=======
  // 1. Use useState to manage the list of tasks
  const [notes, setNotes] = useState(initialNotes);
  const [tasks, setTasks] = useState(initialTasks);

  // 2. Function to add a new task
  const handleAddTask = () => {
    // Create a new task object
    const newTask: Task = {
      id: nextTaskId++, // Use and then increment the ID
      text: `New Task ${nextTaskId - 1}`, // Example text
    };

    // Update the state with the new task appended
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: nextNoteId++, // Use and then increment the ID
      text: `New Note ${nextNoteId - 1}`, // Example text
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleAddRecording = () => {
    const newNote: Note = {
      id: nextNoteId++, // Use and then increment the ID
      text: `New Recording ${nextNoteId - 1}`, // Example text
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

>>>>>>> 887c6fad158d0681445e94e87c30fd5cb8a866ae
  return (
    <div className="container">
      {/* Left - Tasks */}
      <div className="sidebar">
<<<<<<< HEAD
        <h3>📋 Tasks ➕</h3>
=======
        <div className="header-row">
          <button onClick={handleAddTask} className="add-button">
            ➕
          </button>
          <h3>Tasks</h3>
        </div>
>>>>>>> 887c6fad158d0681445e94e87c30fd5cb8a866ae
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className="list-item">
              {task.text}
            </li>
          ))}
        </ul>
      </div>

<<<<<<< HEAD
          <h4>Suggested Tasks</h4>
          <ul className="list">
            {suggestedTasks.map((task) => (
              <li key={task.id} className="list-item">
                {task.text}
              </li>
            ))}
          </ul>
        </div>
=======
      <div className="sidebar">
        <h4>Suggested Tasks</h4>
        <ul className="list">
          {suggestedTasks.map((task) => (
            <li key={task.id} className="list-item">
              {task.text}
            </li>
          ))}
        </ul>
      </div>
>>>>>>> 887c6fad158d0681445e94e87c30fd5cb8a866ae

        {/* Middle - Home Button */}
        <div className="center">
          <button className="home-button">Home</button>
        </div>

<<<<<<< HEAD
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
=======
      {/* Right - Notes */}
      <div className="sidebar">
        <div className="header-row">
          <button onClick={handleAddNote} className="add-button">
            ➕
          </button>
          <button onClick={handleAddRecording} className="add-button">
            🗣️
          </button>
          <h3>Notes </h3>
        </div>
        <ul className="list">
          {notes.map((note) => (
            <li key={note.id} className="list-item">
              {note.text}
            </li>
          ))}
        </ul>
>>>>>>> 887c6fad158d0681445e94e87c30fd5cb8a866ae
      </div>
    </div>
  );
}
