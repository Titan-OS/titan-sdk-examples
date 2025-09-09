const setStatus = (message, type = '') => {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const app2appButton = document.getElementsByClassName('app2appButton');

    for (let i = 0; i < app2appButton.length; i++) {
        app2appButton[i].addEventListener('click', async event => {
            const titanSDK = TitanSDK;
            const apps = ['netflix', 'prime_video', 'plex']
            
            try {
                await titanSDK.apps.launch(apps[i]);
            } catch (error) {
                setStatus(`Failed launch: ${apps[i]}`, 'error');
                console.error('app Control error:', error);
            }
        });
    }

    // [8] Set focus to the first button as default.
    app2appButton[0].focus();
});