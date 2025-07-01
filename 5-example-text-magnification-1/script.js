document.addEventListener('DOMContentLoaded', () => {
    const toggleMagnificationButton = document.getElementById('toggleMagnificationButton');
    const statusMessage = document.getElementById('statusMessage');

    let toggleEnabled = false;

    // [1] - Helper for status messages
    function setStatus(message, type = '') {
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`;
    }

    // [2] - Function to apply/remove magnification based on settings
    function applyTextMagnification(settings) {
        if (settings.enabled) {
            document.documentElement.style.fontSize = `${settings.scale}em`;
            setStatus(`Text magnification applied: Level ${settings.scale}x`, 'success');
        } else {
            document.documentElement.style.fontSize = ''; // Resets to default browser font size (e.g., 16px)
            setStatus('Text magnification disabled.', 'success');
        }
    }

    // Initialize state and listeners
    async function initializeMagnification() {
        const titanSDK = TitanSDK;

        try {
            const tmSupported = await titanSDK.accessibility.isTextMagnificationSupported();
       
            if (!tmSupported) {
                setStatus('Text Magnification is NOT supported on this device.', 'error');
                toggleMagnificationButton.disabled = true;
                return;
            }

            // Get initial settings and apply them
            const initialTMSettings = await titanSDK.accessibility.getTMSettings();
            setStatus(`Initial TM state: ${initialTMSettings.enabled ? `Enabled (${initialTMSettings.scale}x). Click on toggle to apply it.` : 'Disabled'}`);
        } catch (error) {
            setStatus(`Failed to initialize TM: ${error.message}`, 'error');
            console.error('TM initialization error:', error);
        }
    }

    // Event listener for the button (simulates a user interacting with *your app's* TM toggle)
    // NOTE: Here we are forcing enable to false. This is just for testing purposes, as at this
    //       example it should toggle the status.
    toggleMagnificationButton.addEventListener('click', async () => {
        if (toggleMagnificationButton.disabled) return;

        try {
            if (!toggleEnabled) {
                let currentSettings = await TitanSDK.accessibility.getTMSettings();
                applyTextMagnification(currentSettings);
                return toggleEnabled = true;
            }

            applyTextMagnification({ enabled: false });
            return toggleEnabled = false;
        } catch (error) {
            setStatus(`Error toggling magnification: ${error.message}`, 'error');
            console.error('Toggle TM error:', error);
        }
    });

    initializeMagnification();
});