require('dotenv').config();
const { createServer } = require('node:http');
const {
  shortenUrl,
  getUrl,
  deleteUrl,
} = require('./controllers/controllers.js');

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

const server = createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');

  try {
    if (request.method === 'POST' && request.url === '/shorten') {
      shortenUrl(request, response);
    }
    if (request.method === 'GET' && request.url.startsWith('/')) {
      getUrl(request, response);
    }
    if (request.method === 'DELETE' && request.url.startsWith('/')) {
      deleteUrl(request, response);
    } else {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: 'Not Found' }));
    }
  } catch (error) {
    console.error('Error processing request:', error);
    response.statusCode = 500;
    response.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
