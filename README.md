# Full-Stack Authentication System

## Overview
This project implements a secure, production-ready authentication system using React and NestJS. It features JWT-based authentication with access and refresh tokens, following industry best practices for security and user management.

## Technical Stack

### Frontend
- React 18 with TypeScript
- React Context API for auth state management 
- Chakra UI for component library
- React Hook Form for form handling
- Axios with interceptors for API requests
- Vite for build tooling
- React Router v6 for routing

### Backend 
- NestJS with TypeScript
- MongoDB with Mongoose ODM
- JWT authentication (access & refresh tokens)
- bcrypt password hashing
- Swagger/OpenAPI documentation
- Environment-based configuration (@nestjs/config)

## Key Features

### Authentication
- **Token Management**
  - Short-lived access tokens (15 min)
  - Long-lived refresh tokens (7 days) 
  - Automatic token refresh
  - Token invalidation on logout

- **Security**
  - HTTP-only cookies
  - Password hashing with bcrypt
  - Protected routes with Guards
  - CORS protection
  - Rate limiting
  - Environment-based configuration

- **User Management**
  - Email/password registration with validation
  - Secure login flow
  - Session handling
  - Account management

## Architecture

### Frontend
- Centralized auth state with Context API
- Protected routes using HOCs
- Automatic token refresh via Axios interceptors
- Consistent error handling with toasts
- Full TypeScript type safety

### Backend
- Modular architecture (Auth/Users)
- Route protection with Guards & Decorators
- Request validation using DTOs
- Global exception handling
- Type-safe MongoDB integration

## Getting Started

### Prerequisites
- Node.js 16+
- pnpm
- MongoDB

### Installation

1. Clone the repository
