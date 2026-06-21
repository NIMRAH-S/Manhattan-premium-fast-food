# Manhattan Premium Fast Food

A premium fast food restaurant web app built with React, Vite, Firebase Authentication, and a local shopping cart experience.

## Repository

- GitHub repo name: `Manhattan-premium-fast-food`
- Description: Premium fast food restaurant storefront with customer menu browsing, cart checkout, and admin dashboard support.

## Features

- Responsive restaurant homepage and menu browsing
- Product listing, search, and category filtering
- Shopping cart with quantity updates and local persistence
- Checkout page with order summary
- Firebase-powered authentication for admin access
- Admin dashboard for orders and inventory management

## Tech stack

- React 19
- Vite
- TypeScript
- Firebase Authentication
- React Router DOM
- Framer Motion
- Recharts
- Tailwind CSS utility classes
- Lucide icons

## Getting started

### Prerequisites

- Node.js 18+ or compatible version

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root containing your Firebase config values. Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> The app uses Firebase auth and the admin flow is based on a configured admin email in `context/AuthContext.tsx`.

### Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Admin access

Admin routes are protected and require signing in as the configured admin user. The current admin email is defined in `context/AuthContext.tsx`.

## Project structure

- `src/` or root-level files: app entry, routing, and global state providers
- `components/`: reusable UI pieces such as layout, cards, and hero sections
- `pages/`: main customer pages plus admin dashboard views
- `context/`: cart and auth providers
- `services/`: Firebase initialization and database helpers
- `types.ts`: shared TypeScript interfaces

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Notes

- The app uses a hash router for client-side routing.
- Cart state is persisted in `localStorage`.
- Firebase config values must be set before running the app.
