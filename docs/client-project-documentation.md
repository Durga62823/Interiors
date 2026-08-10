# Interiors Pro — Client Project Documentation

## 1. Project Overview
Interiors Pro is a modern, client-facing interior design and renovation website for Neeli Home Designs. The platform combines a polished marketing experience with a lightweight CRM-style admin system that helps the business manage leads, services, portfolio projects, testimonials, blog content, and company settings.

The solution is designed to support both brand presentation and business operations in one place. It enables prospective clients to explore services, view completed projects, request consultations, and receive instant project estimates, while administrators can manage content and monitor incoming leads.

## 2. Key Features
- Public website with pages for Home, Services, Portfolio, About, Blog, Contact, and Estimate
- Lead capture forms for homepage, contact page, and estimate flow
- Interactive cost estimator with room-based pricing and quality tiers
- Portfolio showcase with project details and gallery support
- Content management for services, testimonials, FAQs, blog posts, and company settings
- Admin dashboard with business insights and lead tracking
- Supabase-backed data storage and media uploads
- SEO and branding configuration for marketing consistency

## 3. Folder Structure
- src/
  - routes/ — public and admin route components
  - components/ — layout, navigation, UI, and admin interface components
  - hooks/ — React Query hooks for data access
  - mock-api/ — API-style wrappers around Supabase operations
  - lib/ — app utilities, SEO, analytics, UTM handling, Supabase client
  - types/ — shared TypeScript models
  - assets/ — branding and portfolio imagery
- supabase/
  - migrations/ — database schema and policies
  - functions/ — serverless functions such as lead notification

## 4. Architecture
The project follows a modern React + TypeScript architecture with route-based page organization. The frontend is built with Vite and React, while data access is centralized through hooks and API modules. React Query is used for caching and state synchronization, and TanStack Router manages navigation and route structure.

The architecture is split into three main layers:
1. Presentation layer — pages, layouts, and UI components
2. Data layer — hooks and API modules that interact with Supabase
3. Content and settings layer — database-driven content for services, projects, leads, and branding

This approach keeps the interface interactive while allowing business data to be updated without requiring frontend code changes.

## 5. Database
The application uses Supabase as its primary backend and database service.

Core tables include:
- services
- portfolio_projects
- testimonials
- leads
- company_settings
- blog_posts
- faqs
- quotations
- quotation_line_items
- lead_notes
- room_pricing

The database design supports public-read operations for marketing content and authenticated CRUD access for administrators. Supabase Storage is also used for images and branding assets.

## 6. API and Integration Layer
The application uses a Supabase client for all database interactions. The data access layer is organized under the mock-api folder, which exposes functions such as:
- createLead
- getServices
- getPortfolioProjects
- getTestimonials
- getSettings
- create/update/delete content records

These modules communicate with Supabase tables and storage, while the hooks layer provides React components with clean access to that data. The system also includes serverless function support for lead notification workflows.

## 7. User Flow
### Public User Flow
1. A visitor lands on the homepage and views services, portfolio, and testimonials.
2. The user can request a callback, submit a contact form, or use the cost estimator.
3. Lead information is collected and stored in the database.
4. The admin team can review the new inquiry and follow up.

### Admin User Flow
1. The administrator signs in through the secure admin area.
2. The dashboard displays summary metrics such as total leads and projects.
3. The admin can manage services, portfolio work, testimonials, FAQs, quotations, blog content, and settings.
4. Updates are reflected instantly in the public-facing website.

## 8. Technology Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- TanStack Query
- Framer Motion
- Supabase
- ShadCN-style UI components
- Recharts for dashboard visualization
- React Hook Form + Zod for forms

## 9. Business Value
This project provides a professional digital presence for an interior design company while reducing manual operational effort. It supports lead generation, portfolio presentation, and internal business management from a single platform.

## 10. Summary
Interiors Pro is a scalable, content-driven website and admin platform tailored for a design-led business. It balances elegant presentation with practical operational tools, making it well suited for client acquisition and day-to-day business management.
