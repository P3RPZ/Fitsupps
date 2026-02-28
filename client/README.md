# FitSupps E-Commerce Platform

A full-stack e-commerce web application for selling fitness supplements.

## Features

- Product browsing and search
- Shopping cart functionality
- User authentication and authorization
- Order management
- Admin panel for product, order, and user management

## Tech Stack

- **Frontend**: React 19.1.1, React Router DOM
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT tokens

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Install client dependencies
cd client
npm install
```

### Development

```bash
# Start backend server (from root)
npm start

# Start frontend (from client directory)
cd client
npm start
```

### Production Build

```bash
# Build for production
cd client
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
