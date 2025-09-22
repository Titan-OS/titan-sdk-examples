// server.js
const http = require('http');
const fs = require('fs');
const os = require('os');

const PORT = 8080;

/**
 * Finds the first non-internal IPv4 address on the machine.
 */
function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const interfaceInfo of networkInterface) {
      // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if (!interfaceInfo.internal && interfaceInfo.family === 'IPv4') {
        return interfaceInfo.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost
}

const server = http.createServer((req, res) => {
  const ipAddress = getIpAddress();

  // Read the menu.html file from the disk
  fs.readFile('./index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading index.html');
      return;
    }

    // Replace the placeholder with the actual IP address
    const modifiedHtml = data.replace(/%%IP_ADDRESS%%/g, ipAddress);

    // Serve the modified HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(modifiedHtml);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ipAddress = getIpAddress();
  console.log(`[MENU] Server is running!`);
  console.log(`[MENU] Access your hub from any device on this network at: \x1b[94mhttp://${ipAddress}:${PORT}\x1b[0m`);
});