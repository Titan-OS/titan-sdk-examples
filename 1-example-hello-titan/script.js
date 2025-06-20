/*
  Introduction
  
  The idea of this code is only to show how get started and have access to
  all functions and properties, like devices details and capabilities.
*/

document.addEventListener('DOMContentLoaded', async () => {
  const element = document.getElementById('sdk-data');

  try {
    // [1]
    const titanSdk = TitanSDK;

    // [2]
    displayObjectAsHTML(titanSdk, element);
  } catch (error) {
    element.innerText = 'Error on loading SDK: ' + error.message;
  };
});

/*
  [1] - Access the global variable TitanSDK.
        Note: Make sure you have the script imported.
  [2] - This code is not part of the SDK! It's just to display the
        object at the screen, so you can see what is comming from
        titanSDK instance.
*/
