// src/App.tsx

import React, { useState, useEffect, useRef } from 'react';

// Import the SDK function and relevant types for full type safety
import { getTitanSDK, TitanSDK, DeviceInfo, PublicTTSSettings, PublicTMSettings } from '@titan-os/sdk';

// Define a type for our tabs to ensure we only use valid identifiers
type TabID = 'deviceInfo' | 'tts' | 'tm';

// Define the data structure for our tabs to keep the JSX clean
const tabs: { id: TabID; label: string }[] = [
  { id: 'deviceInfo', label: 'Device Info' },
  { id: 'tts', label: 'Text-to-speech Settings' },
  { id: 'tm', label: 'Text magnification Settings' },
];

// Combine the SDK types with our added 'isSupported' property
interface TtsData extends PublicTTSSettings { isSupported: boolean; }
interface TmData extends PublicTMSettings { isSupported: boolean; }

function App() {
  const [activeTab, setActiveTab] = useState<TabID>('deviceInfo');
  const [displayData, setDisplayData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sdkRef = useRef<TitanSDK | null>(null);

  // This useEffect runs only once on mount to initialize the SDK
  useEffect(() => {
    const initSdk = async () => {
      try {
        const sdk = getTitanSDK();
        await sdk.isReady;
        sdkRef.current = sdk;
      } catch (error) {
        console.error("Failed to initialize Titan SDK", error);
        setDisplayData('Error: Could not initialize Titan SDK.');
      }
    };
    initSdk();
  }, []); // Empty array ensures it runs once

  // This useEffect runs whenever the activeTab changes, or after the SDK is initialized
  useEffect(() => {
    const sdk = sdkRef.current;
    // Don't fetch until the SDK is ready
    if (!sdk) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data: DeviceInfo | TtsData | TmData;
        
        // Fetch data based on the active tab
        switch (activeTab) {
          case 'tts':
            const ttsSettings = await sdk.accessibility.getTTSSettings();
            const isTtsSupported = await sdk.accessibility.isTTSSupported();
            data = { ...ttsSettings, isSupported: isTtsSupported };
            break;
          
          case 'tm':
            const tmSettings = await sdk.accessibility.getTMSettings();
            const isTmSupported = await sdk.accessibility.isTextMagnificationSupported();
            data = { ...tmSettings, isSupported: isTmSupported };
            break;

          case 'deviceInfo':
          default:
            data = await sdk.deviceInfo.getDeviceInfo();
            break;
        }

        // Format the data for display in the <pre> tag
        setDisplayData(JSON.stringify(data, null, 2));

      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        setDisplayData(`Error fetching data: ${message}`);
        console.error(`Failed to fetch data for tab ${activeTab}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, sdkRef.current]); // Re-run when activeTab changes OR when sdkRef gets populated

  return (
    <div id="app">
      <h1>Titan SDK - Properties</h1>
      <div id="tabs">
        {/* Render buttons by mapping over our tabs data array */}
        {tabs.map(tab => (
          <button
            key={tab.id}
            // Apply 'active' class conditionally based on state
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            // Update the activeTab state on click
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div id="sdk-container">
        <div className="pre-wrapper">
          <pre id="sdk-data" tabIndex={0}>
            {/* Conditionally render content based on the loading state */}
            {isLoading ? 'Loading...' : displayData}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;