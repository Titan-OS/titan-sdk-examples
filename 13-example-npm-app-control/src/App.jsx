import React from 'react';
import { getTitanSDK } from '@titan-os/sdk';

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
  
  // Here is where the magic happens!
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

  // [8] Set focus to the first button as default.
  React.useEffect(() => {
    firstButtonRef.current?.focus();
  }, []);

  return (
    <div className="container">
      <h1>App Control Demo</h1>
      
      <div className="app2appButtons">
        {apps.map((app, index) => (
          <button
            key={app.id}
            className="app2appButton"
            onClick={() => handleLaunchApp(app.id)}
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