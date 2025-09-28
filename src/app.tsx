import React from "react";
import "./app.css";

let nextTaskId = 1;

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

const notes: Note[] = [
  { id: 1, text: "Note #1" },
  { id: 2, text: "Recording #1" },
];

export default function App() {
  return (
    <div className="container">
      {/* Left - Tasks */}
      <div className="sidebar">
        <h3>📋 Tasks ➕</h3>
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
    </div>
  );
}
