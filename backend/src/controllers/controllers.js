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
      const { userId, originalUrl } = JSON.parse(body);
      const existingUrl = await prisma.url.findFirst({
        where: {
          originalUrl: originalUrl,
          userId: userId,
        },
      });
      if (existingUrl) {
        response.statusCode = 200;
        response.end(JSON.stringify({ shortCode: existingUrl.shortCode }));
        return;
      }

      const timestamp = new Date();
      const url = await prisma.url.create({
        data: {
          shortCode: shortCode,
          userId: userId,
          originalUrl: originalUrl,
          timestamp: timestamp,
        },
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
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });
  request.on('end', async () => {
    try {
      const shortCode = JSON.parse(body).shortCode;
      const url = await prisma.url.findUnique({
        where: {
          shortCode: shortCode,
        },
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
  });
}

async function deleteURL(request, response) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', async () => {
    try {
      const { shortCode, userId } = JSON.parse(body);
      const userIdToDeleteUrl = await prisma.url.findFirst({
        where: {
          shortCode: shortCode,
          userId: userId,
        },
      });
      if (!userIdToDeleteUrl) {
        response.statusCode = 403;
        response.end(JSON.stringify({ error: 'You do not own this link' }));
        return;
      }
      const urlToDelete = await prisma.url.delete({
        where: {
          shortCode: shortCode,
          userId: userId,
        },
      });
      response.statusCode = 200;
      response.end(JSON.stringify({ message: 'URL deleted successfully' }));
    } catch (error) {
      console.error('Error deleting URL:', error);
      response.statusCode = 500;
      response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
}

async function getUserLinks(request, response) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', async () => {
    try {
      const { userId } = JSON.parse(body);
      const userLinks = await prisma.url.findMany({
        where: {
          userId: userId,
        },
      });
      response.statusCode = 200;
      response.end(JSON.stringify({ links: userLinks }));
    } catch (error) {
      console.error('Error retrieving user links:', error);
      response.statusCode = 500;
      response.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
}

module.exports = {
  shortenURL,
  getURL,
  deleteURL,
  getUserLinks,
};
