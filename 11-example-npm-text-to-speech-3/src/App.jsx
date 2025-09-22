// src/App.jsx

// We need a few more hooks from React this time:
// - useState: To manage the status message.
// - useEffect: To run initialization code once the app loads.
// - useRef: To hold a reference to the SDK instance and to set initial focus.
import React, { useState } from 'react';

// Import the SDK function, replacing the global script tag
import { getTitanSDK } from '@titan-os/sdk';

// To make the code cleaner, we can define our carousel items as data
const carouselItems = [
  { id: 1, label: 'Movies 1', aria: 'Carousel of movies: movie 1' },
  { id: 2, label: 'Movies 2', aria: 'Carousel of movies: movie 2' },
  { id: 3, label: 'Movies 3', aria: 'Carousel of movies: movie 3' },
  { id: 4, label: 'Movies 4', aria: 'Carousel of movies: movie 4' },
  { id: 5, label: 'Movies 5', aria: 'Carousel of movies: movie 5' },
];

function App() {
  // [1] - This app simulates a carousel with TTS applied to the navigation.

  // A state to hold our status message and its type ('success' or 'error')
  const [status, setStatus] = useState({ message: '', type: '' });
  
  // A ref to hold the initialized SDK instance so we can access it anywhere in the component
  const sdkRef = React.useRef(null);
  
  // A ref for the first button, so we can focus it on load
  const firstButtonRef = React.useRef(null);

  // This useEffect hook runs once on component mount, replacing 'DOMContentLoaded'
  React.useEffect(() => {
    const initializeSDK = async () => {
      try {
        // [4] - Get the SDK instance from the imported function.
        const titanSDK = getTitanSDK();
        await titanSDK.isReady;
        sdkRef.current = titanSDK; // Store the instance in our ref

        // [2] - Check TTS support and if it's enabled.
        // [2.2] - Check if TTS is supported on the device
        const isSupported = await titanSDK.accessibility.isTTSSupported();
        if (!isSupported) {
          setStatus({ message: 'Text-to-Speech is NOT supported on this device.', type: 'error' });
          return;
        }

        // [2.3] - Get current TTS settings to see if it's enabled by the user
        const settings = await titanSDK.accessibility.getTTSSettings();
        if (!settings.enabled) {
          setStatus({ message: 'Text-to-Speech is DISABLED by the user in TV settings.', type: 'error' });
          return;
        }

        setStatus({ message: 'TTS is enabled and ready.', type: 'success' });

        // [8] Set focus to the first button as default.
        firstButtonRef.current?.focus();

      } catch (error) {
        setStatus({ message: `SDK Initialization Error: ${error.message}`, type: 'error' });
      }
    };
    
    initializeSDK();
  }, []); // Empty array ensures this runs only once.

  // [3] - This function handles the focus event for all carousel items.
  const handleButtonFocus = async (event) => {
    // [4] - Access the SDK instance stored in our ref.
    const titanSDK = sdkRef.current;
    if (!titanSDK) return;

    try {
      // [5] - Clear the last speaking event.
      await titanSDK.accessibility.stopSpeaking();

      // [6] - Get the text to speak from the aria-label of the focused button
      const textToSpeak = event.target.getAttribute('aria-label');

      if (textToSpeak) {
        // [7] - Initiate speaking
        await titanSDK.accessibility.startSpeaking(textToSpeak);
        setStatus({ message: `Speaking: ${textToSpeak}`, type: 'success' });
      }

    } catch (error) {
      setStatus({ message: `Failed to speak: ${error.message}`, type: 'error' });
      console.error('Text-to-Speech error:', error);
    }
  };

  return (
    <div className="container">
      <h1>Text-to-Speech Demo: Carousel navigation</h1>
      
      <div className="speakButtons">
        {/* We map over our data array to create the buttons dynamically */}
        {carouselItems.map((item, index) => (
          <button
            key={item.id}
            className="speakButton"
            aria-label={item.aria}
            onFocus={handleButtonFocus} // We use React's onFocus event handler
            ref={index === 0 ? firstButtonRef : null} // Attach the ref to the first button
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* The status message is rendered from our state */}
      <div id="statusMessage" className={`status ${status.type}`}>
        {status.message}
      </div>
    </div>
  );
}

export default App;