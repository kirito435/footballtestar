# Replit Development Guide

## Overview

This is a real-time multiplayer Arabic football trivia game built with a modern full-stack architecture. The application allows players to join game rooms, answer football-related questions in Arabic, and compete in both individual and team modes with live scoring and real-time communication.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with WebSocket support for real-time communication
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui components for a polished UI
- **Real-time Communication**: WebSocket server for live game interactions

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with TanStack Query for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom Arabic font support (Tajawal)
- **Build Tool**: Vite with custom path aliases and development plugins

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Real-time**: WebSocket server using 'ws' library
- **Database ORM**: Drizzle ORM with PostgreSQL adapter
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot reload with tsx for TypeScript execution

### Database Schema
The application uses four main tables:
- **users**: Player authentication and profiles
- **game_rooms**: Game session management with configurable modes
- **game_players**: Player participation tracking and scoring
- **questions**: Arabic football trivia content with multiple choice answers

### UI/UX Design
- **Internationalization**: Right-to-left (RTL) layout support for Arabic content
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Radix UI primitives ensure keyboard navigation and screen reader support
- **Theme System**: CSS custom properties for consistent styling

## Data Flow

1. **Game Initialization**: Players create or join rooms through REST API endpoints
2. **Real-time Connection**: WebSocket connection established for live game features
3. **Question Flow**: Server manages question distribution and answer collection
4. **Scoring System**: Real-time score updates broadcast to all room participants
5. **Game State Management**: Server maintains game state with client synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **ws**: WebSocket server implementation
- **connect-pg-simple**: PostgreSQL session store

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Modern icon library

### Development Dependencies
- **vite**: Fast build tool with HMR support
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application is configured for Replit's autoscale deployment with the following setup:

### Build Process
- **Development**: `npm run dev` runs both client and server with hot reload
- **Production Build**: Vite builds client assets, esbuild bundles server code
- **Asset Serving**: Express serves static files in production mode

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Port Configuration**: Server runs on port 5000 with external port 80
- **Static Assets**: Built client assets served from dist/public directory

### Replit Integration
- **Modules**: Configured for Node.js 20, web development, and PostgreSQL 16
- **Workflows**: Automated development workflow with port forwarding
- **Cartographer**: Development debugging support in Replit environment

Changelog:
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.