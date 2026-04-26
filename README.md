# Smallr - URL Shortener

A Full-Stack URL shortener service built with Node.js, SQLite, and Prisma.

## Prerequisites

- Node.js v16+ (v24.6.0 recommended)
- npm

## Installation

1. Clone the repository and navigate to the backend folder:
```bash
cd backend
npm install
```

2. Run Prisma Migration:
```bash
npx prisma migrate dev --name init
```

3. Run the Server:
```bash
node server.js
```

View the Database:
```bash
cd backend
npx prisma studio
```