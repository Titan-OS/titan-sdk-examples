import React from 'react';

// Import the SDK function
import { getTitanSDK } from '@titan-os/sdk';

function App() {
  // State for the status message and its type ('success' or 'error')
  const [status, setStatus] = React.useState({ message: '', type: '' });
  
  // State to control if the magnification is currently applied by our button
  const [isMagnificationApplied, setIsMagnificationApplied] = React.useState(false);
  
  // State to disable the button if the feature is not supported
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  // [1] - Helper for status messages, now using our React state
  const updateStatus = (message, type = '') => {
    setStatus({ message, type });
  };

  // [2] - Function to apply/remove magnification. This is a rare case where direct
  // DOM manipulation is okay in React, as we're changing a global property on the <html> element.
  const applyTextMagnification = (settings) => {
    if (settings.enabled) {
      document.documentElement.style.fontSize = `${settings.scale}em`;
      updateStatus(`Text magnification applied: Level ${settings.scale}x`, 'success');
    } else {
      document.documentElement.style.fontSize = ''; // Resets to default
      updateStatus('Text magnification disabled.', 'success');
    }
  };

  React.useEffect(() => {
    // Initialize state and check for support
    const initializeMagnification = async () => {
      try {
        const titanSDK = getTitanSDK();

        const isSupported = await titanSDK.accessibility.isTextMagnificationSupported();
     
        if (!isSupported) {
          updateStatus('Text Magnification is NOT supported on this device.', 'error');
          setIsButtonDisabled(true);
          return;
        }

        // Get initial settings just to display the status
        const initialSettings = await titanSDK.accessibility.getTMSettings();
        updateStatus(
          `Initial TM state: ${initialSettings.enabled ? `Enabled (${initialSettings.scale}x). Click toggle to apply.` : 'Disabled'}`,
          ''
        );
      } catch (error) {
        updateStatus(`Failed to initialize TM: ${error.message}`, 'error');
        console.error('TM initialization error:', error);
      }
    };

    initializeMagnification();
  }, []); // The empty array [] ensures this runs only once

  // Event handler for the button click
  const handleToggleClick = async () => {
    try {
      if (!isMagnificationApplied) {
        // If not applied, get current settings and apply them
        const currentSettings = await getTitanSDK().accessibility.getTMSettings();
        applyTextMagnification(currentSettings);
        setIsMagnificationApplied(true);
      } else {
        // If already applied, disable it
        applyTextMagnification({ enabled: false });
        setIsMagnificationApplied(false);
      }
    } catch (error) {
      updateStatus(`Error toggling magnification: ${error.message}`, 'error');
      console.error('Toggle TM error:', error);
    }
  };

  return (
    <div className="container">
      <h1>TitanOS Text Magnification Demo</h1>
      
      <p className="magnifiable-text">
        This is a sample paragraph to demonstrate text magnification. 
        The font size of this text will change when you toggle the magnification. 
        It's important to ensure your app's UI adapts correctly to varying text sizes for accessibility.
      </p>
      
      <button 
        id="toggleMagnificationButton"
        onClick={handleToggleClick}
        disabled={isButtonDisabled} // The button's disabled state is controlled by React state
      >
        Toggle Text Magnification
      </button>
      
      <div id="statusMessage" className={`status ${status.type}`}>
        {status.message}
      </div>
    </div>
  );
}

export default App;