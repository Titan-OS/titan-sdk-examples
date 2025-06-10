/*
  Introduction
  
  The idea of this code is only to show how to create an
  SDK instance. By creating it, you will have access to
  functions like getDeviceInfo and getCapabilities.
*/

document.addEventListener('DOMContentLoaded', async () => {
  const element = document.getElementById('sdk-data');

  try {
    // [1]
    const titanSdk = await TitanSDK();

    // [2]
    displayObjectAsHTML(titanSdk, element);
  } catch (error) {
    element.innerText = 'Error on loading SDK: ' + error.message;
  };
});

/*
  [1] - Start using TitanSDK by creating an instance from TitanSDK.
        Note: Make sure you have the script imported.
  [2] - This code is not part of the SDK! It's just to display the
        object at the screen, so you can see what is comming from
        titanSDK instance.
*/
