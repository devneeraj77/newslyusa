# NewslyUSA Project Context

## Project Overview

NewslyUSA is a modern, high-performance news platform built with **Next.js 16** (React 19). It features a responsive design, dynamic content management, and a secure admin interface. The application utilizes **MongoDB** for data storage, accessed via **Prisma ORM**. Authentication is handled by **NextAuth.js (v5)**.

## Key Technologies

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Database:** MongoDB
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js v5 (Credentials Provider)
*   **Styling:** Tailwind CSS v4, SASS, Framer Motion
*   **UI Components:** Radix UI, Embla Carousel, Tiptap Editor
*   **Linting/Formatting:** Biome

## Project Structure

*   `src/app`: App Router pages and layouts.
    *   `(app)`: Public-facing pages (Home, Categories, Articles).
    *   `(admin)`: Admin dashboard and content management.
    *   `api`: Backend API routes (News fetching, Cron jobs, Uploads).
*   `src/actions`: Server Actions for form handling and admin operations (e.g., deleting subscribers).
*   `src/components`: Reusable UI components.
    *   `carousels`: Sliders for news highlights.
    *   `tiptap-*`: Rich text editor components for article creation.
*   `src/lib`: Utilities and configuration (Prisma client, Auth config).
*   `prisma`: Database schema (`schema-mongodb.prisma`) and seed scripts.

## Getting Started

### Prerequisites

*   Node.js (v20+ recommended)
*   MongoDB instance (local or Atlas)

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Environment Setup:
    Ensure a `.env` file exists with `DATABASE_URL` and other necessary keys (Cloudinary, NextAuth secret, etc.).

3.  Generate Prisma Client:
    ```bash
    npm run prisma:generate
    ```
    *Note: The project uses `prisma/schema-mongodb.prisma`.*

### Running the Application

*   **Development Server:**
    ```bash
    npm run dev
    ```
    Access the site at `http://localhost:3000`.

*   **Production Build:**
    ```bash
    npm run build
    npm run start
    ```

## Development Workflow

*   **Database Schema:**
    Modify `prisma/schema-mongodb.prisma` for schema changes. Run `npm run prisma:generate` to update the client.
    *   *Note:* MongoDB is schema-less, so `prisma migrate` is not used.

*   **Authentication:**
    The Admin login uses a Credentials provider (`src/auth.ts`) validating against the `Admin` collection in MongoDB. Passwords are hashed with `bcryptjs`.

*   **Content Management:**
    Content (Posts, Categories, Tags) is managed via the `/admin` route. The text editor is powered by Tiptap.

## Common Scripts

*   `npm run dev`: Start development server.
*   `npm run build`: Build for production.
*   `npm run lint`: Run Biome linter.
*   `npm run format`: Format code with Biome.
*   `npm run prisma:generate`: Generate Prisma Client from MongoDB schema.
