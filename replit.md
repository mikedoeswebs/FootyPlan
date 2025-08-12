# FootyPlan - Football Training Session Generator

## Overview

FootyPlan is a full-stack web application that generates dynamic football (soccer) training session plans using OpenAI's ChatGPT API. The application allows coaches and players to create structured, unique training plans based on session type, focus area, duration, and participant count. The system features user authentication, subscription-based usage quotas with Stripe integration, and session management capabilities including PDF and JSON export functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy using session-based authentication
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Password Security**: Node.js crypto module with scrypt hashing and salt generation
- **API Structure**: RESTful endpoints with middleware for authentication and quota checking

### Data Layer
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Schema Design**: Two main entities (users and sessions) with proper foreign key relationships and JSON storage for complex session data

### Authentication & Authorization
- **Strategy**: Session-based authentication with secure HTTP-only cookies
- **User Management**: Username/email registration with hashed password storage
- **Session Management**: Server-side session storage with PostgreSQL
- **Route Protection**: Middleware-based route protection with user context injection

### AI Integration
- **Provider**: OpenAI GPT-4o for session generation
- **Prompt Engineering**: Structured system prompt enforcing JSON schema compliance
- **Session Structure**: Predefined schema including warm-up, practices, small-sided games, and cool-down with SVG diagrams
- **Content Variety**: Random seed injection for unique session variations

### Subscription & Billing
- **Payment Processing**: Stripe integration for subscription management
- **Quota System**: Usage-based limitations (5 free sessions/month, unlimited for pro users)
- **Plan Management**: Monthly quota reset with upgrade capabilities
- **Billing Enforcement**: Pre-generation quota validation middleware

## External Dependencies

### Core Services
- **OpenAI API**: GPT-4o for training session content generation
- **Stripe**: Payment processing and subscription management
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development environment with custom cartographer plugin

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Production bundling for server-side code
- **PostCSS**: CSS processing with Autoprefixer

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Wouter**: Lightweight routing solution

### Data & State Management
- **Drizzle ORM**: Type-safe database interactions
- **TanStack Query**: Server state management and caching
- **Zod**: Schema validation and type inference
- **React Hook Form**: Form state management and validation