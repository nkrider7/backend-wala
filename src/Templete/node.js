export const nodejsTemplate = () => `
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const hostname = '127.0.0.1';

/*
use the hostname varable value from .env file
const hostname = process.env.HOSTNAME || "127.0.0.1' ;
*/

const port = 3000; 

/*
* Your .env avaible in root directory of your package.json
* You can use it to store your sensitive data

* import dotenv form 'dotenv'
* dotenv.config()

* const port = process.env.PORT || 3000;
*/

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  
  // Basic route handling
  if (parsedUrl.pathname === '/' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Backend Wala🍬 Server is running...');
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
  
  // More routes and logic can be added here
  
});

server.listen(port, hostname, () => {
  console.log(\`Server running at http://\${hostname}:\${port}/\`);
});
`;
