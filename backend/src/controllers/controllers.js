require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');

const prisma = new PrismaClient();

async function shortenURL(originalUrl) {};

async function getURL(shortCode) {};

async function deleteURL(shortCode) {};