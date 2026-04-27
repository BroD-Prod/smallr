require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');

const prisma = new PrismaClient();

async function shortenURL(originalUrl) {
  const shortCode = nanoid(10);

  const url = await prisma.url.create({
    data: {
      shortCode: shortCode,
      originalUrl: originalUrl,
    },
  });
  return url;
}

async function getURL(shortCode) {
  const originalUrl = await prisma.url.findUnique({
    where: {
      shortCode: shortCode,
    },
  });
  return originalUrl;
}

async function deleteURL(shortCode) {
  await prisma.url.delete({
    where: {
      shortCode: shortCode,
    },
  });
  return shortCode;
}
