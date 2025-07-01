/*
  NOTE:

  The following code is only needed for this example!
  TitanSDK doesn't depend on it. Please, focus on the
  script file.
*/

function extractObject(obj, indent = 0) {
  const space = '  '.repeat(indent);
  let output = '{\n';
  for (const key of Reflect.ownKeys(obj)) {
    let value;
    try {
      value = obj[key];
    } catch (err) {
      value = `[Getter threw error: ${err.message}]`;
    }
    output += `${space}  "${key}": `;
    if (typeof value === 'function') {
      output += `"ƒ ${value.name || 'anonymous'}()",\n`;
    } else if (typeof value === 'object' && value !== null) {
      output += extractObject(value, indent + 1) + ',\n';
    } else {
      output += JSON.stringify(value) + ',\n';
    }
  }
  output += space + '}';

  return output;
}

function displayObjectAsHTML(obj, element, indent = 0) {
  const object = extractObject(obj, indent);
  element.innerText = object;
}
