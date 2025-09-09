import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface StatusMessage {
  text: string;
  type: 'success' | 'error' | '';
}

const TtsCarousel = () => {
  const [status, setStatus] = useState<StatusMessage>({ text: '', type: '' });
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  // Use a variable to hold the global SDK reference
  const titanSDK = window.TitanSDK;

  const setStatusMessage = (text: string, type: 'success' | 'error' | '' = '') => {
    setStatus({ text, type });
  };

  // Consolidate initial checks and focus logic into a single useEffect
  useEffect(() => {
    const checkTtsAndSetFocus = async () => {
      if (!titanSDK) {
        setStatusMessage('TitanSDK not found. Make sure the script is loaded.', 'error');
        return;
      }

      try {
        const ttsSupported = await titanSDK.accessibility.isTTSSupported();
        if (!ttsSupported) {
          setStatusMessage('Text-to-Speech is NOT supported on this device.', 'error');
          return;
        }
        setStatusMessage('TTS is supported. Checking user settings...');

        const ttsSettings = await titanSDK.accessibility.getTTSSettings();
        if (!ttsSettings.enabled) {
          setStatusMessage('Text-to-Speech is DISABLED by the user in TV settings.', 'error');
          return;
        }

        setStatusMessage('TTS is ready!', 'success');

        // Set focus to the first button
        if (buttonsRef.current[0]) {
          setTimeout(() => buttonsRef.current[0].focus(), 100);
        }
      } catch (error) {
        setStatusMessage(`Failed to initialize TTS.`, 'error');
        console.error('TTS initialization error:', error);
      }
    };


    checkTtsAndSetFocus();
    buttonsRef.current[0].focus();
  }, [titanSDK]);

  const handleFocus = async (event: React.FocusEvent<HTMLButtonElement>) => {
    try {
      await titanSDK?.accessibility.stopSpeaking();
      const textToSpeak = event.currentTarget.getAttribute('aria-label');
      if (textToSpeak) {
        await titanSDK?.accessibility.startSpeaking(textToSpeak);
        setStatusMessage('Speaking: ' + textToSpeak, 'success');
      }
    } catch {
      setStatusMessage(`Failed to speak`, 'error');
      console.error('Text-to-Speech error:');
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