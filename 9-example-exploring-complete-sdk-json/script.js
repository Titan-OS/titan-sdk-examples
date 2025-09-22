document.addEventListener('DOMContentLoaded', () => {
  // Ensure your custom display function is available
  if (typeof displayObjectAsHTML === 'undefined') {
    // ... (error handling as before)
    return;
  }

  const titanSdk = TitanSDK;

  // Get references to all UI elements
  const dataContainer = document.getElementById('sdk-data');
  const allTabs = document.querySelectorAll('.tab-button');
  const btnDeviceInfo = document.getElementById('btn-device-info');
  const btnTTS = document.getElementById('btn-tts');
  const btnTM = document.getElementById('btn-tm');
  const copyButton = document.getElementById('copy-button'); // Get the new button

  // A variable to store the raw JSON of the currently displayed tab
  let currentJsonObject = null;

  /**
   * Updates the visual 'active' state for the selected tab.
   */
  const setActiveTab = (selectedButton) => {
    // ... (function is the same as before)
    allTabs.forEach(tab => tab.classList.remove('active'));
    selectedButton.classList.add('active');
  };
  
  /**
   * A generic function to fetch data and display it.
   * @param {Promise} sdkPromise - The SDK function to call.
   */
  const fetchDataAndDisplay = (data) => {
    displayObjectAsHTML(data, dataContainer);
    dataContainer.focus();
  };

  // --- Attach Event Listeners for Tabs ---
  btnDeviceInfo.addEventListener('click', async () => {
    dataContainer.textContent = 'Loading...';
    setActiveTab(btnDeviceInfo);
    const deviceInfo = await titanSdk.deviceInfo.getDeviceInfo();
    fetchDataAndDisplay(deviceInfo);
  });

  btnTTS.addEventListener('click', async () => {
    dataContainer.textContent = 'Loading...';
    setActiveTab(btnTTS);
    let settings = await titanSdk.accessibility.getTTSSettings();
    settings.isSupported = await titanSdk.accessibility.isTTSSupported();
    fetchDataAndDisplay(settings);
  });

  btnTM.addEventListener('click', async () => {
    dataContainer.textContent = 'Loading...';
    setActiveTab(btnTM);
    let settings = await titanSdk.accessibility.getTMSettings();
    settings.isSupported = await titanSdk.accessibility.isTextMagnificationSupported();
    console.log(settings);
    fetchDataAndDisplay(settings);
  });

  // --- Initial Load ---
  btnDeviceInfo.click();
});