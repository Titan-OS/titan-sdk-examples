import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// NEW: Import the SDK function and its TypeScript type from the npm package.
import { getTitanSDK, TitanSDK } from '@titan-os/sdk';

interface StatusMessage {
  text: string;
  type: 'success' | 'error' | '';
}

const TtsCarousel = () => {
  const [status, setStatus] = useState<StatusMessage>({ text: '', type: '' });
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  const sdkRef = useRef<TitanSDK | null>(null);

  const setStatusMessage = (text: string, type: 'success' | 'error' | '' = '') => {
    setStatus({ text, type });
  };

  useEffect(() => {
    const checkTtsAndSetFocus = async () => {
      try {
        // Initializing the SDK instance and storing it in the ref
        const titanSDK = getTitanSDK();
        sdkRef.current = titanSDK;

        // Runing the support and settings checks using the instance
        const ttsSupported = await titanSDK.accessibility.isTTSSupported();
        if (!ttsSupported) {
          setStatusMessage('Text-to-Speech is NOT supported on this device.', 'error');
          return;
        }
        
        const ttsSettings = await titanSDK.accessibility.getTTSSettings();
        if (!ttsSettings.enabled) {
          setStatusMessage('Text-to-Speech is DISABLED by the user in TV settings.', 'error');
          return;
        }

        setStatusMessage('TTS is ready!', 'success');

        // Setting focus to the first button after all checks pass
        buttonsRef.current[0]?.focus();

      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        setStatusMessage(`Failed to initialize TTS: ${message}`, 'error');
        console.error('TTS initialization error:', error);
      }
    };

    checkTtsAndSetFocus();
  }, []);

  const handleFocus = async (event: React.FocusEvent<HTMLButtonElement>) => {
    // 1. Get the attribute value and the SDK instance *before* any await calls.
    const textToSpeak = event.currentTarget.getAttribute('aria-label');
    const titanSDK = sdkRef.current;

    // 2. Guard against the SDK not being ready.
    if (!titanSDK) return; 

    try {
      // 3. Now it's safe to use await.
      await titanSDK.accessibility.stopSpeaking();

      if (textToSpeak) {
        await titanSDK.accessibility.startSpeaking(textToSpeak);
        setStatusMessage('Speaking: ' + textToSpeak, 'success');
      }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        setStatusMessage(`Failed to speak: ${message}`, 'error');
        console.error('Text-to-Speech error:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const activeElement = document.activeElement as HTMLElement;
    if (!activeElement || !activeElement.classList.contains('speakButton')) {
      return;
    }

    const currentIndex = buttonsRef.current.indexOf(activeElement as HTMLButtonElement);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % buttonsRef.current.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + buttonsRef.current.length) % buttonsRef.current.length;
    }

    if (buttonsRef.current[nextIndex]) {
      buttonsRef.current[nextIndex].focus();
    }
  };

  const movies = ['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5'];

  return (
    <div className="container" onKeyDown={handleKeyDown}>
      <h1>Text-to-Speech Demo: Carousel navigation</h1>
      <div className="speakButtons">
        {movies.map((movie, index) => (
          <button
            key={index}
            className="speakButton"
            aria-label={`Carousel of movies: ${movie}`}
            onFocus={handleFocus}
            ref={el => { buttonsRef.current[index] = el as HTMLButtonElement; }}
          >
            Movies {index + 1}
          </button>
        ))}
      </div>
      <div className={`status ${status.type}`} id="statusMessage">
        {status.text}
      </div>
    </div>
  );
};

export default TtsCarousel;