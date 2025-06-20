/*
  Introduction

  This example demonstrates how to use the accessibility features from the Titan SDK.
  Specifically, it shows how to:

  - Check if Text-To-Speech (TTS) is supported using `isTTSSupported()`
  - Start speaking a message using `startSpeaking()`
  - Stop the current speech using `stopSpeaking()`

  These functions are part of the accessibility module, which enables speech feedback
  for users with visual impairments or reading difficulties.
*/

document.addEventListener('DOMContentLoaded', async () => {
  const supportEl = document.getElementById('tts-support');
  const speakBtn = document.getElementById('speak-button');
  const stopBtn = document.getElementById('stop-button');

  try {
    // [1] Access the global variable TitanSDK.
    // Note: Make sure you have the script imported.
    const titanSdk = TitanSDK;
    const accessibility = titanSdk.accessibility;

    // [2] Check if Text-to-Speech is supported
    accessibility.isTTSSupported().then(supported => {
      supportEl.innerText = `TTS Supported: ${supported}`;                
    });

    // [3] Start speaking a predefined message when the user clicks the "Speak" button
    speakBtn.addEventListener('click', () => {
      const message = 'Hello Titan developer! This is the Text to Speech test.';
      accessibility.startSpeaking(message);
    });

    // [4] Stop the current speech when the user clicks the "Stop" button
    stopBtn.addEventListener('click', () => {
      accessibility.stopSpeaking();
    });

  } catch (error) {
    supportEl.innerText = 'Error loading SDK: ' + error.message;
  }
});
