document.addEventListener('DOMContentLoaded', () => {
    const toggleMagnificationButton = document.getElementById('toggleMagnificationButton');
    const statusMessage = document.getElementById('statusMessage');

    // Helper for status messages
    function setStatus(message, type = '') {
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`;
    }

    // Function to apply/remove magnification based on settings
    function applyTextMagnification(settings) {
        // As per your documentation: document.documentElement.style.fontSize = `${settings.level}em`;
        if (settings.enabled) {
            document.documentElement.style.fontSize = `${settings.level}em`;
            setStatus(`Text magnification applied: Level ${settings.level}x`, 'success');
        } else {
            document.documentElement.style.fontSize = ''; // Resets to default browser font size (e.g., 16px)
            setStatus('Text magnification disabled.', 'success');
        }
    }

    let currentZoomLevelIndex = 0;
    const zoomLevels = [1.0, 1.2, 1.5, 1.8]; // Example zoom levels you might want to cycle through

    // Initialize state and listeners
    async function initializeMagnification() {
        const titanSDK = TitanSDK;

        if (typeof titanSDK === 'undefined' || !titanSDK.accessibility) {
            setStatus('Error: TitanSDK.accessibility is not available. Ensure SDK is loaded.', 'error');
            console.error('TitanSDK.accessibility not found.');
            return;
        }

        try {
            const tmSupported = await titanSDK.accessibility.isTextMagnificationSupported();
            if (!tmSupported) {
                setStatus('Text Magnification is NOT supported on this device.', 'error');
                toggleMagnificationButton.disabled = true;
                return;
            }
            
            // Listen for system-wide TM setting changes (as shown in your docs)
            titanSDK.accessibility.onTMSettingsChange(applyTextMagnification);

            // Get initial settings and apply them
            const initialTMSettings = await titanSDK.accessibility.getTMSettings();
            applyTextMagnification(initialTMSettings);
            setStatus(`Initial TM state: ${initialTMSettings.enabled ? `Enabled (${initialTMSettings.level}x)` : 'Disabled'}`);

        } catch (error) {
            setStatus(`Failed to initialize TM: ${error.message}`, 'error');
            console.error('TM initialization error:', error);
        }
    }

    // Event listener for the button (simulates a user interacting with *your app's* TM toggle)
    toggleMagnificationButton.addEventListener('click', async () => {
        if (toggleMagnificationButton.disabled) return;

        try {
            // Get current mock settings
            let currentSettings = await TitanSDK.accessibility.getTMSettings();
            
            let newEnabledState;
            let newLevel;

            if (currentSettings.enabled) {
                // If currently enabled, disable it
                newEnabledState = false;
                newLevel = 1.0; // Reset to base level
            } else {
                // If currently disabled, enable it and cycle through levels
                newEnabledState = true;
                currentZoomLevelIndex = (currentZoomLevelIndex + 1) % zoomLevels.length;
                newLevel = zoomLevels[currentZoomLevelIndex];
            }
        } catch (error) {
            setStatus(`Error toggling magnification: ${error.message}`, 'error');
            console.error('Toggle TM error:', error);
        }
    });

    initializeMagnification();
});