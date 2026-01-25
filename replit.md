# Skyntales Skincare E-Commerce Application

## Overview
Skyntales is a full-stack skincare e-commerce web application designed for a seamless shopping experience. It features product browsing, user authentication, a shopping cart, wishlists, and a secure checkout process. The project aims to provide a robust platform for selling skincare products online, with a comprehensive admin panel for managing products, orders, users, and marketing campaigns. Key capabilities include real-time inventory updates, dynamic content management, and integration with payment and shipping services.

## User Preferences
- **Festival Theme Colors**: Theme colors should only affect buttons, badges, and footer - not other UI elements like headers or page backgrounds. The header and general page backgrounds remain consistent regardless of active theme.

## System Architecture

### Core Technologies
-   **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI
-   **Backend**: Firebase (Firestore, Authentication, Storage), Express.js
-   **State Management**: React Context API, TanStack Query
-   **Routing**: React Router DOM v6

### UI/UX Decisions
-   **Styling**: Tailwind CSS with custom design tokens for a consistent and modern aesthetic.
-   **Components**: Utilizes Shadcn UI for pre-built, accessible, and customizable UI components.
-   **Dynamic Theming**: An admin-controlled festival themes system dynamically alters specific UI elements based on events or seasons. Themes are managed via `/admin/themes` with date-based activation and priority rules.
    - **Theme-affected elements**: Buttons, badges, footer, and hero section animations/overlays
    - **Fixed elements**: Header, page backgrounds, and general text styling remain consistent
    - **Color System**: Uses `--primary` and `--accent` CSS variables that update dynamically with themes, while `--brand-primary-fixed` stays constant for elements like headers

### Technical Implementations
-   **Authentication**: Firebase Authentication with email/password and Google Sign-In. Admin roles are managed via a dedicated `adminUsers` Firestore collection.
-   **Data Storage**: Firebase Firestore for all dynamic data, including products, users, carts, wishlists, orders, reviews, contacts, and admin configurations.
-   **Real-time Sync**: Shopping cart and wishlist functionality are synchronized in real-time with Firestore.
-   **Product Management**: Comprehensive CRUD operations for products, categories (`collections`), featured items, and promotional content through the admin panel. Products are linked to collections, and the hero section dynamically displays featured products configured in the admin.
-   **Order Management**: Admins can view and update order statuses.
-   **Payment Flow**: Secure checkout integrated with RazorPay, involving server-side validation of cart totals and payment verification.
-   **Newsletter System**: Allows user subscription and enables admins to send newsletters with custom content and subject via a dedicated admin interface, utilizing an HTML email template.
-   **Project Structure**: Organized into `components`, `contexts`, `data`, `hooks`, `lib`, `pages`, and `services` for modularity and maintainability.

### Feature Specifications
-   **Customer Features**: Product browsing with filtering/sorting, product detail pages, shopping cart, wishlist, user profile, checkout, contact form, search.
-   **Admin Features**: Dashboard overview, product management (add, edit, delete with comprehensive fields including sizes, images, descriptions), order management, contact message viewing, user management, advertisement pop-up creation, blog management, Instagram post management, newsletter subscriber management and sending, printable receipts.

## External Dependencies
-   **Firebase**: Authentication, Firestore (database), Cloud Storage.
-   **RazorPay**: Payment Gateway for processing transactions.
-   **Express.js**: Used for the payment API backend (`create-order`, `verify-payment`) and newsletter sending (`send-newsletter`).
-   **Resend**: Email service used for sending newsletters (configured via Replit integration connector).
-   **Shiprocket**: Shipping and logistics platform for order tracking (integrates via API for real-time tracking data).
-   **Vite**: Frontend build tool.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Shadcn UI**: Reusable UI components built on Tailwind CSS and Radix UI.
-   **TanStack Query**: Data fetching and state management library.
-   **React Router DOM**: Declarative routing for React.