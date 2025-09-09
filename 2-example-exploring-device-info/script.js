/*
  Introduction
  
  The idea of this code is to explore the deviceInfo property.
  Note that this property is an object containing some functions
  to return information related to the device and it's capabilities.
*/

document.addEventListener('DOMContentLoaded', async () => {
  const element = document.getElementById('sdk-data');

  try {
    // [1]
    const titanSdk = TitanSDK;

    // [2]
    titanSdk.deviceInfo.getDeviceInfo().then(data => {
      displayObjectAsHTML(data, element);
    });

  } catch (error) {
    element.innerText = 'Error on loading SDK: ' + error.message;
  };
});

/*
  [1] - Access the global variable TitanSDK.
        Note: Make sure you have the script imported.
  [2] - Note that getDeviceInfo is a promise, so you can wait for
        the response using async/await or then.
*/