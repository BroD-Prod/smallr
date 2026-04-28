require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');

const prisma = new PrismaClient();

async function shortenURL(request, response) {
  const shortCode = nanoid(10);

  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', async () => {
    try {
      const { originalUrl } = JSON.parse(body);
      const url = await prisma.url.create({
        data: {
          originalUrl: originalUrl,
          shortCode: shortCode,
        }
      });
      response.end(JSON.stringify({ shortCode: url.shortCode }));
    } catch (error) {
      console.error('Error shortening URL:', error);
      response.statusCode = 500;
      response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
}

async function getURL(request, response) {
    try{
      const shortCode = request.url.slice(1);
      const url = await prisma.url.findUnique({
        where : {
          shortCode: shortCode,
        }
      });
      if (!url) {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: 'URL not found' }));
        return;
      }
      response.statusCode = 301;
      response.setHeader('Location', url.originalUrl);
      response.end();
    } catch (error) {
      console.error('Error retrieving URL:', error);
      response.statusCode = 500;
      response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

async function deleteURL(request, response) {
  try {
    const shortCode = request.url.slice(1);
    const urlToDelete = await prisma.url.delete({
      where: {
        shortCode: shortCode,
      }
    });
    if (!urlToDelete) {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: 'URL not found' }));
      return;
    }
    response.end(JSON.stringify({ message: 'URL deleted successfully' }));
  } catch (error) {
    console.error('Error deleting URL:', error);
    response.statusCode = 500;
    response.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

module.exports = {
  shortenURL,
  getURL,
  deleteURL,
};
