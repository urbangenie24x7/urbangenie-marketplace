# UrbanGenie - Multi-Vertical Marketplace Platform

A comprehensive marketplace platform supporting multiple verticals: Food, Grocery, FreshCuts (Meat), Health, and Services.

## Architecture

- **Monorepo**: Turborepo + pnpm workspaces
- **Web**: Next.js 14 with shared components
- **Mobile**: React Native (Expo)
- **Admin**: Vertical-specific dashboards
- **Shared**: UI components, hooks, utilities

## Verticals

### FreshCuts (Meat Marketplace)
- Local meat vendors
- Product variations (weight, cuts)
- Same-day delivery
- SEO optimized with rich snippets

### Food Delivery
- Restaurant partnerships
- Real-time tracking
- Multi-cuisine support

### Grocery
- Supermarket integration
- Bulk ordering
- Subscription model

### Health & Wellness
- Pharmacy integration
- Health consultations
- Medicine delivery

### Services
- Home services
- Professional services
- Booking system

## Getting Started

```bash
pnpm install
pnpm dev
```

## Tech Stack

- Next.js 14, React 18, TypeScript
- Firebase (Auth, Firestore, Storage)
- Tailwind CSS, Turborepo
- React Native (Mobile)
- Cloudinary (Images)