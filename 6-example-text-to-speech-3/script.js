// [1] - This app simulates a carousel with TTS aplied to the navigation.
// NOTE: In a real TitanOS app, TitanSDK would be globally available or imported.

const isTSSEnabled = async () => {
    const titanSDK = TitanSDK;

    // [2.2] - Check if TTS is supported on the device
    const ttsSupported = await titanSDK.accessibility.isTTSSupported();
    if (!ttsSupported) {
        setStatus('Text-to-Speech is NOT supported on this device.', 'error');
        console.log('TTS not supported on this device');
        return;
    }
    setStatus('TTS is supported. Checking user settings...');

    // [2.3] - Get current TTS settings to see if it's enabled by the user
    const ttsSettings = await titanSDK.accessibility.getTTSSettings();
    if (!ttsSettings.enabled) {
        setStatus('Text-to-Speech is DISABLED by the user in TV settings.', 'error');
        console.log('TTS is disabled by user');
        return;
    }
}

// [2] - Simple helper for status messages
const setStatus = (message, type = '') => {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    // [2] - Check TTS support and if it's enabled.
    const isEnabled = await isTSSEnabled();

    if (isEnabled) {
        return;
    }

    const speakButton = document.getElementsByClassName('speakButton');

    // [3] - Apply the focus event for all carousel items
    for (let i = 0; i < speakButton.length; i++) {
        speakButton[i].addEventListener('focus', async event => {
            // [4] - Access the global variable TitanSDK.
            // Note: Make sure you have the script imported.
            const titanSDK = TitanSDK;
            
            try {
                // [5] - Clear the last speaking event. If not, it will
                // speak all triggered "speaking" events in the queue.
                await titanSDK.accessibility.stopSpeaking();

                // [6] - Get the text to speak from the aria-label at the <button> element
                const textToSpeak = event.srcElement?.getAttribute('aria-label');

                // [7] - Initiate speaking
                await titanSDK.accessibility.startSpeaking(textToSpeak);
                setStatus('Speaking: ' + textToSpeak, 'success');

            } catch (error) {
                setStatus(`Failed to speak: ${error.message}`, 'error');
                console.error('Text-to-Speech error:', error);
            }
        });
    }

    // [8] Set focus to the first button as default.
    speakButton[0].focus();
});