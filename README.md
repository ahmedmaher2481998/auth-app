# Auth App Monorepo

A full-stack authentication application built with React, NestJS, and MongoDB.

## Project Structure

```
auth-app/
├── packages/
│   └── types/          # Shared TypeScript types
├── client/            # React frontend
├── server/            # NestJS backend
└── docker-compose.yml # Docker configuration
```

## Prerequisites

- Node.js 18 or later
- pnpm
- Docker and Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd auth-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Build shared types:
```bash
pnpm build:types
```

4. Set up environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
   - Update the values as needed

5. Start the application using Docker:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017

## Development

To run the application in development mode:

1. Start MongoDB:
```bash
docker-compose up mongodb
```

2. Start the backend:
```bash
pnpm dev:server
```

3. Start the frontend:
```bash
pnpm dev:client
```

## Features

- User registration and login
- JWT authentication with refresh tokens
- Protected routes
- MongoDB database
- Shared TypeScript types between frontend and backend
- Docker containerization
- Modern UI with Chakra UI

## Testing

```bash
# Run backend tests
cd server && pnpm test

# Run frontend tests
cd client && pnpm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 