// src/App.jsx

// React hooks 'useState' and 'useEffect' are fundamental for managing
// component state and side-effects (like loading data).
import React, { useState, useEffect } from 'react';

// [1] - Import the getTitanSDK function from the npm package.
//       This replaces the global 'TitanSDK' variable from the <script> tag.
import { getTitanSDK } from '@titan-os/sdk';

/*
  Introduction
  
  The idea of this code is to explore the deviceInfo property.
  Note that this property is an object containing some functions
  to return information related to the device and it's capabilities.
*/

function App() {
  // We use React state to hold the data that will be displayed.
  // 'sdkData' is the variable holding the data, and 'setSdkData' is the function to update it.
  // It starts with a 'Loading...' message, just like your original code.
  const [sdkData, setSdkData] = useState('Loading...');

  // The 'useEffect' hook replaces your 'DOMContentLoaded' event listener.
  // It runs automatically after the component is rendered on the screen.
  useEffect(() => {
    // We define an async function inside to fetch the SDK data.
    const initializeAndFetchData = async () => {
      try {
        const titanSdk = getTitanSDK();
        
        // As per the new README, it's best practice to wait for the SDK to be ready.
        await titanSdk.isReady;

        // [2] - Note that getDeviceInfo is a promise, so we can wait for
        //       the response using async/await.
        const data = await titanSdk.deviceInfo.getDeviceInfo();
        
        // Instead of a separate 'displayObjectAsHTML' function, we simply format
        // the object as a readable JSON string and update our state.
        // React will automatically re-render the component to show this new data.
        setSdkData(JSON.stringify(data, null, 2));

      } catch (error) {
        setSdkData('Error on loading SDK: ' + error.message);
      };
    };

    // Call the function to start the process.
    initializeAndFetchData();

  }, []); // The empty '[]' tells React to run this effect only ONCE, like DOMContentLoaded.

  // This is the JSX that React will render as HTML.
  // It's the same structure as your original <body> content.
  return (
    <div id="app">
      <h1>Titan SDK - Properties</h1>
      <div id="sdk-container">
          <pre id="sdk-data" tabIndex="0">
            {/* The content here is now bound to our 'sdkData' state variable */}
            {sdkData}
          </pre>
      </div>
    </div>
  );
}

export default App;