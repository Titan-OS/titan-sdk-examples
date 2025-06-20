// In a real TitanOS app, TitanSDK would be globally available or imported.
// For local testing in a browser without the actual SDK, you'd need to mock it.
// We'll assume TitanSDK is available as per your documentation examples.

document.addEventListener('DOMContentLoaded', () => {
    const speakButton = document.getElementById('speakButton');
    const speechTextElement = document.getElementById('speechText');
    const statusMessage = document.getElementById('statusMessage');

    // Simple helper for status messages
    function setStatus(message, type = '') {
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`;
    }

    speakButton.addEventListener('click', async () => {
        setStatus('Checking TTS support...');
        // [1] Access the global variable TitanSDK.
        // Note: Make sure you have the script imported.
        const titanSDK = TitanSDK;
        
        try {
            // [2] Check if TTS is supported on the device
            const ttsSupported = await titanSDK.accessibility.isTTSSupported();
            if (!ttsSupported) {
                setStatus('Text-to-Speech is NOT supported on this device.', 'error');
                console.log('TTS not supported on this device');
                return;
            }
            setStatus('TTS is supported. Checking user settings...');

            // [3] Get current TTS settings to see if it's enabled by the user
            const ttsSettings = await titanSDK.accessibility.getTTSSettings();
            if (!ttsSettings.enabled) {
                setStatus('Text-to-Speech is DISABLED by the user in TV settings.', 'error');
                console.log('TTS is disabled by user');
                return;
            }
            setStatus('TTS is supported and enabled. Speaking...');

            // [4] Get the text to speak from the <p> element
            const textToSpeak = speechTextElement.textContent;

            // [5] Initiate speaking
            await titanSDK.accessibility.startSpeaking(textToSpeak);
            setStatus('Text-to-Speech initiated successfully!', 'success');

        } catch (error) {
            setStatus(`Failed to speak: ${error.message}`, 'error');
            console.error('Text-to-Speech error:', error);
        }
    });
});