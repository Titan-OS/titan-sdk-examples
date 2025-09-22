// src/App.jsx

import React from 'react';

// Import the SDK function from the npm package
import { getTitanSDK } from '@titan-os/sdk';

// A better practice in React is to define our UI data in a structured way.
// This avoids mismatches between button text and the app ID to launch.
const apps = [
  { id: 'netflix', displayText: 'Open Netflix' },
  { id: 'prime_video', displayText: 'Open Prime' },
  { id: 'plex', displayText: 'Open Flow' }, // Note: Using 'plex' ID as in your original JS for the "Flow" button
];

function App() {
  // State to manage the status message
  const [status, setStatus] = React.useState({ message: '', type: '' });
  
  // A ref to the first button element, used to set initial focus
  const firstButtonRef = React.useRef(null);

  // Helper function to update status, now using React state
  const updateStatus = (message, type = '') => {
    setStatus({ message, type });
  };
  
  // This event handler is called when any of the app buttons are clicked
  const handleLaunchApp = async (appId) => {
    try {
      // Get a fresh SDK instance and launch the app
      await getTitanSDK().apps.launch(appId);
      updateStatus(`Successfully launched ${appId}`, 'success');
    } catch (error) {
      updateStatus(`Failed to launch: ${appId}`, 'error');
      console.error('App Control error:', error);
    }
  };

  // This useEffect hook runs once after the component mounts
  React.useEffect(() => {
    // [8] Set focus to the first button as default.
    // The '?' is optional chaining, it prevents an error if the ref isn't set yet.
    firstButtonRef.current?.focus();
  }, []); // The empty dependency array ensures this runs only once.

  return (
    <div className="container">
      <h1>App Control Demo</h1>
      
      <div className="app2appButtons">
        {/* We map over our 'apps' array to render the buttons dynamically */}
        {apps.map((app, index) => (
          <button
            key={app.id}
            className="app2appButton"
            // We pass the specific app's ID to the handler
            onClick={() => handleLaunchApp(app.id)}
            // We attach the ref only to the very first button in the list
            ref={index === 0 ? firstButtonRef : null}
          >
            {app.displayText}
          </button>
        ))}
      </div>
      
      <div id="statusMessage" className={`status ${status.type}`}>
        {status.message}
      </div>
    </div>
  );
}

export default App;