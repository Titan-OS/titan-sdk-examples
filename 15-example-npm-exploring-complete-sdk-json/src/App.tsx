import React, { useState, useEffect, useRef } from 'react';
import { getTitanSDK, TitanSDK, DeviceInfo, PublicTTSSettings, PublicTMSettings } from '@titan-os/sdk';

type TabID = 'deviceInfo' | 'tts' | 'tm';

const tabs: { id: TabID; label: string }[] = [
  { id: 'deviceInfo', label: 'Device Info' },
  { id: 'tts', label: 'Text-to-speech Settings' },
  { id: 'tm', label: 'Text magnification Settings' },
];
interface TtsData extends PublicTTSSettings { isSupported: boolean; }
interface TmData extends PublicTMSettings { isSupported: boolean; }

function App() {
  const [activeTab, setActiveTab] = useState<TabID>('deviceInfo');
  const [displayData, setDisplayData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sdkRef = useRef<TitanSDK | null>(null);

  useEffect(() => {
    const initSdk = async () => {
      try {
        const sdk = getTitanSDK();
        sdkRef.current = sdk;
      } catch (error) {
        console.error("Failed to initialize Titan SDK", error);
        setDisplayData('Error: Could not initialize Titan SDK.');
      }
    };
    initSdk();
  }, []); 

  useEffect(() => {
    const sdk = sdkRef.current;
    if (!sdk) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data: DeviceInfo | TtsData | TmData;
        
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
  }, [activeTab, sdkRef.current]);

  return (
    <div id="app">
      <h1>Titan SDK - Properties</h1>
      <div id="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div id="sdk-container">
        <div className="pre-wrapper">
          <pre id="sdk-data" tabIndex={0}>
            {isLoading ? 'Loading...' : displayData}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;