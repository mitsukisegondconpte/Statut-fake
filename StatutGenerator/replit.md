# Overview

This is a WhatsApp Status Generator application that allows users to create realistic-looking WhatsApp status screenshots. The application lets users customize status messages, backgrounds, viewer lists, and reactions to generate authentic-looking WhatsApp status interfaces for sharing or demonstration purposes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with **React** and **TypeScript**, using a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety and better development experience
- **Styling**: Tailwind CSS for utility-first styling with custom WhatsApp-themed color variables
- **Component Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **State Management**: React hooks for local component state, with React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

The application follows a clean component structure with separation of concerns:
- UI components in `client/src/components/ui/`
- Feature-specific components in `client/src/components/`
- Pages in `client/src/pages/`
- Utilities and hooks in `client/src/lib/` and `client/src/hooks/`

## Backend Architecture

The backend uses **Express.js** with TypeScript in an ESM setup:

- **Framework**: Express.js for HTTP server and API routes
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints for name generation and status configuration
- **Validation**: Zod schemas for request validation and type safety
- **Development**: TSX for running TypeScript directly in development

The server provides a simple API for generating fake names based on different cultural preferences (French, Creole, International, or mixed).

## Data Storage Solutions

The application uses a minimal storage approach:

- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Centralized schema definitions in `shared/schema.ts`
- **Current Implementation**: The app currently operates with in-memory data structures for the core functionality, with database infrastructure ready for future enhancements

The storage layer is intentionally lightweight since the primary use case is generating temporary status screenshots rather than persistent user data management.

## Authentication and Authorization

Currently, the application does not implement user authentication or authorization mechanisms. This design choice reflects the tool's purpose as a simple utility for generating WhatsApp status mockups without requiring user accounts or data persistence.

# External Dependencies

## Frontend Dependencies

- **@radix-ui/***: Comprehensive set of accessible UI primitives for building the component library
- **@tanstack/react-query**: Server state management and caching for API interactions
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx & tailwind-merge**: Class name utilities for conditional styling
- **cmdk**: Command palette component for enhanced user interactions
- **date-fns**: Date manipulation and formatting utilities
- **embla-carousel-react**: Carousel component for UI interactions
- **react-hook-form**: Form state management and validation
- **wouter**: Lightweight routing solution for single-page application navigation
- **html2canvas**: Screenshot generation capability for exporting status previews

## Backend Dependencies

- **@neondatabase/serverless**: Neon Database client for serverless PostgreSQL connections
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Integration between Drizzle and Zod for schema validation
- **connect-pg-simple**: PostgreSQL session store (prepared for future session management)
- **zod**: Runtime type validation and schema definition

## Development and Build Tools

- **Vite**: Frontend build tool and development server with hot module replacement
- **TypeScript**: Static type checking for both frontend and backend code
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **PostCSS**: CSS processing with autoprefixer for browser compatibility
- **TSX**: TypeScript execution environment for development
- **ESBuild**: Fast JavaScript bundler for production builds

## External Services

- **Neon Database**: Serverless PostgreSQL database hosting
- **Unsplash**: Image hosting service for avatar placeholders (via CDN links)
- **Google Fonts**: Font hosting for typography (Architects Daughter, DM Sans, Fira Code, Geist Mono)