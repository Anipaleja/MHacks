import React, { useState } from "react";
import "./app.css";

let nextTaskId = 1;

type Task = { id: number; text: string };
type Note = { id: number; text: string };

const initialTasks: Task[] = [];

const suggestedTasks: Task[] = [
  { id: 5, text: "Task 1" },
  { id: 6, text: "Task 2" },
];

const notes: Note[] = [
  { id: 1, text: "Note #1" },
  { id: 2, text: "Recording #1" },
];

export default function App() {
  // 1. Use useState to manage the list of tasks
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

  return (
    <div className="container">
      {/* Left - Tasks */}
      <div className="sidebar">
        <div className="header-row">
          <button onClick={handleAddTask} className="add-button">
            ➕ Add Task
          </button>
          <h3>📋 Tasks ➕</h3>
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
  );
}
