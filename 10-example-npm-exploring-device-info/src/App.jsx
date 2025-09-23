/*
  Introduction
  
  The idea of this code is to explore the deviceInfo property.
  Note that this property is an object containing some functions
  to return information related to the device and it's capabilities.
*/

import React, { useState, useEffect } from 'react';
// [1] - Import the getTitanSDK function from the npm package.
//       This replaces the global 'TitanSDK' variable from the <script> tag.
import { getTitanSDK } from '@titan-os/sdk';


function App() {
  const [sdkData, setSdkData] = useState('Loading...');

  useEffect(() => {
    const initializeAndFetchData = async () => {
      try {
        const titanSdk = getTitanSDK();

        // [2] - Note that getDeviceInfo is a promise, so we can wait for
        //       the response using async/await.
        const data = await titanSdk.deviceInfo.getDeviceInfo();
        
        setSdkData(JSON.stringify(data, null, 2));

      } catch (error) {
        setSdkData('Error on loading SDK: ' + error.message);
      };
    };

    initializeAndFetchData();

  }, []);

  return (
    <div id="app">
      <h1>Titan SDK - Properties</h1>
      <div id="sdk-container">
          <pre id="sdk-data" tabIndex="0">
            {sdkData}
          </pre>
      </div>
    </div>
  );
}

export default App;