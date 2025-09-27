import React from "react";
// The new way to import client-side rendering for React 18+
import ReactDOM from "react-dom/client";

import App from "./app"; // Import your main application component

// 1. Find the root element from public/index.html
const rootElement = document.getElementById("root");

// 2. Check if the root element exists and is an HTMLElement (for TypeScript safety)
if (!rootElement) {
  throw new Error('Failed to find the root element with id="root".');
}

// 3. Create a root and render the application
// We use the non-null assertion operator '!' here since we checked above
// or, more strictly, we use the 'if' block to satisfy TypeScript.
const root = ReactDOM.createRoot(rootElement);

root.render(
  // <React.StrictMode> is a helpful development tool that performs checks
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: If you are using performance tracking (like reportWebVitals in CRA), you would call it here:
// reportWebVitals();
