# Library Management System

A beginner-friendly MERN stack project for managing books, members, and library transactions.

## Project structure

```text
library-management-system/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## Technology stack

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose

## Setup

### Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

If MongoDB is not installed locally, the server will automatically start an in-memory MongoDB instance for development.

### Frontend

```bash
cd client
npm install
npm run dev
```

## Features

- Dashboard with total books, members, issued books, and returned books
- CRUD for books
- CRUD for members
- Issue and return book transactions
- Responsive user interface

## Notes

This project follows the folder structure and technology guidance from the project documentation PDF.
