# Skyntales Skincare E-Commerce Application

## Overview
Skyntales is a full-stack skincare e-commerce web application. The application uses React with TypeScript for the frontend and Firebase for backend services including authentication, database, and storage.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Firestore, Authentication, Storage), Express.js (Payment API)
- **Payment**: RazorPay Payment Gateway
- **State Management**: React Context API, TanStack Query
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom design tokens

## Project Structure
```
src/
├── assets/          # Static images and assets
├── components/      # Reusable UI components
│   ├── admin/       # Admin panel components
│   ├── layout/      # Header, Footer, Navigation
│   ├── popups/      # Cart, Wishlist, Profile, Search popups
│   └── ui/          # Shadcn UI components
├── contexts/        # React contexts for global state
│   ├── AuthContext.tsx      # Firebase authentication
│   ├── CartContext.tsx      # Shopping cart with Firestore
│   └── WishlistContext.tsx  # Wishlist with Firestore
├── data/            # Static data (products, categories)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and Firebase config
│   ├── firebase.ts  # Firebase initialization
│   └── utils.ts     # Helper functions
├── pages/           # Route components
│   └── admin/       # Admin panel pages
└── services/        # API services (product service)
```

## Environment Variables
The application uses the following environment variables (stored as Replit Secrets):

### Firebase Configuration
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_APP_ID` - Firebase App ID
- `VITE_FIREBASE_PROJECT_ID` - Firebase Project ID

### RazorPay Configuration
- `VITE_RAZORPAY_KEY_ID` - RazorPay Key ID (used on frontend)
- `RAZORPAY_KEY_SECRET` - RazorPay Key Secret (used on backend only)

### Firestore Collections
- `users` - User profiles and preferences
- `carts` - Shopping cart items (subcollection keyed by userId)
- `wishlists` - Wishlist items (subcollection keyed by userId)
- `adminUsers` - Admin role verification
- `products` - Product catalog managed via admin panel
- `orders` - Order records from checkout
- `reviews` - Customer product reviews
- `contacts` - Customer support inquiries from contact form

## Authentication

### Demo Admin Account
- **Email**: admin@kanva.com
- **Password**: admin123

To use the demo admin account:
1. Go to `/account` and sign up with the demo email/password
2. The system automatically grants admin access to this email
3. After login, you'll see a link to the Admin Dashboard

### Setting Up Custom Admins
To grant admin access to any user:
1. Create the user account through normal registration
2. In Firebase Console, add a document to the `adminUsers` collection:
   - Document ID: User's UID
   - Field: `isAdmin: true`
   - Field: `email: user's email`

### Google Sign-In
Google Sign-In requires additional configuration in Firebase Console:
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Google provider
3. Add your Replit domain to authorized domains

## Features

### Customer Features
- Browse products by category with filtering and sorting
- Product detail pages with size selection
- Shopping cart with real-time Firestore sync
- Wishlist for saving favorite products
- User profile management with address storage
- Checkout flow with order creation
- Contact form with Firestore integration
- Search functionality across products

### Admin Features (at /admin)
- Dashboard with statistics overview
- **Product Management**: Add, edit, delete products (synced with Firebase)
- **Order Management**: View and update order status
- **Contact Messages**: View and respond to contact form submissions
- **User Management**: View registered users
- **Advertisement Management**: Create popup ads that display on website load
- **Blog Management**: Create and publish blog articles
- **Instagram Posts**: Manage Instagram posts displayed on homepage with links to actual posts
- **Newsletter Management**: Collect subscriber emails and send newsletters via Resend

## Routes
- `/` - Home page
- `/shop` - Product listing
- `/shop/:category` - Category filtered products
- `/shop/product/:id` - Product detail
- `/checkout` - Checkout flow
- `/account` - User account/authentication
- `/contact` - Contact form
- `/about` - About page
- `/admin` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/contact` - Contact messages management
- `/admin/newsletter` - Newsletter subscriber management and sending
- `/admin/ads` - Advertisement popup management
- `/admin/blogs` - Blog post management
- `/admin/instagram` - Instagram posts management

## Running the Application
The application runs both the frontend (port 5000) and payment API server (port 3001):
```bash
npm run dev
```

This command starts:
- Vite dev server on port 5000 (frontend)
- Express API server on port 3001 (RazorPay payment processing)

The Vite config proxies `/api/*` requests to the Express server.

## Product Data Model
Products in Firestore include the following fields:
- `name` - Product name (required)
- `price` - Base price in INR (first size's price)
- `category` - Product category (required)
- `stock` - Inventory count
- `status` - "Active", "Draft", or "Out of Stock"
- `images` - Array of up to 4 image URLs
- `image` - Main image URL (first from images array)
- `description` - Brief product description
- `size` - Default size (first size from sizes array)
- `sizes` - Array of size variants, each with `{ size: string, price: number }`
- `details` - Detailed product information
- `howToUse` - Usage instructions
- `ingredients` - Full ingredient list
- `deliveryReturn` - Shipping and return policy

## Recent Changes (December 2024)
- Migrated backend from PostgreSQL/Drizzle to Firebase
- Implemented Firebase Authentication with email/password
- Created real-time cart and wishlist sync with Firestore
- Added comprehensive admin panel with Firebase integration
- Created checkout page with order creation
- Updated Contact page to save messages to Firestore
- Connected all admin pages to Firebase for real-time data
- Redesigned Account page from tab-based to page-based layout with sidebar navigation
- Added cart and wishlist count badges in Header
- Enhanced Admin Products form with comprehensive fields (4 images, size, details, how to use, ingredients, delivery & return)
- Connected cart popup to checkout page for seamless shopping flow

### December 10, 2024 - End-to-End Firebase Migration
- **CollectionsContext**: Created new context for real-time collections data from Firebase
- **Admin Collections Page**: Full CRUD operations for managing product collections/categories
- **Header Navigation**: Dynamic collections and products dropdown from Firebase
- **Shop Page**: Fully dynamic with real-time products and collections from Firebase
- **CategoryPage**: Fetches products by category from Firebase with filtering and sorting
- **ProductsSection**: Home page displays actual product images from Firebase
- **AdminDashboard**: Real-time statistics (orders, products, customers, revenue) from Firebase
- **WishlistContext**: Updated to support both string (Firebase) and number product IDs
- Removed all static dummy data - website now fully end-to-end with Firebase

### Firestore Collections (Updated)
- `collections` - Product collections/categories (name, slug, description, image, productCount)
- `products` - Products with `category` field matching collection names (now linked to collections)
- `featuredProducts` - Hero section featured products with position and slide index
- `orders` - Customer orders with shipping info and totals
- `reviews` - Product reviews with ratings
- `users` - User profiles
- `carts` / `wishlists` - User cart and wishlist items (subcollections)
- `newsletterSubscribers` - Email subscribers (email, subscribedAt, status)

## Recent Features (December 10, 2024 - Latest)
- **Product-Collection Linking**: Products are linked to collections via the category dropdown in AdminProducts (fetches collections from Firebase)
- **Featured Products Management**: Admin page at `/admin/featured` for managing hero section products with:
  - Unique slide/position validation (prevents duplicate assignments)
  - Grouped display by slide (Slide 1, 2, 3)
  - Shows product category and price
  - Visual feedback for taken positions
- **Hero Section Dynamic**: Hero section fetches featured products from Firebase in real-time with:
  - Complete product data hydration (name, image, price)
  - No static fallback - only shows products configured in admin panel
  - Proper price formatting
- **Complete Dummy Data Removal**: All static product data has been removed:
  - Deleted `src/data/products.ts` static file
  - ProductDetail fetches product data directly from Firebase
  - SearchPopup searches products from Firebase in real-time
  - Related products section shows products from same category in Firebase
  - Cart and Wishlist contexts now accept Firebase string IDs
- **Position Control**: 5 positions per slide (center, top-left, top-right, bottom-left, bottom-right)
- **Admin Menu**: "Featured" menu item with sparkle icon in admin sidebar

## Payment Integration (RazorPay)

### Payment Flow
1. Customer fills shipping details and proceeds to payment
2. Frontend sends cart items to `/api/create-order`
3. Server validates cart and calculates total server-side
4. Server creates RazorPay order and returns order_id
5. Frontend opens RazorPay checkout modal
6. After payment, frontend sends payment details to `/api/verify-payment`
7. Server verifies payment signature
8. On success, order is created in Firebase with payment details

### API Endpoints
- `POST /api/create-order` - Creates RazorPay order with server-calculated total
- `POST /api/verify-payment` - Verifies payment signature
- `POST /api/send-newsletter` - Sends newsletters to subscribers (requires Firebase Auth token)
- `GET /api/health` - Health check endpoint

### Test Cards (for testing)
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

### Security Notes
- Cart totals are recalculated server-side to prevent price manipulation
- Payment signatures are verified before order creation
- For production, implement Firebase Admin SDK to verify product prices from database

## Shiprocket Integration (Order Tracking)

### Configuration
Shiprocket API credentials are stored as Replit Secrets:
- `SHIPROCKET_EMAIL` - Shiprocket API user email
- `SHIPROCKET_PASSWORD` - Shiprocket API user password

### Getting Shiprocket Credentials
1. Log in to Shiprocket Panel
2. Go to Settings → API → Configure
3. Create an API User with email and password
4. Add these credentials as Replit Secrets

### Order Tracking Flow
1. When an order is shipped, update the order in Firebase with `awbCode` (tracking number)
2. Customers can click on their order to see detailed tracking information
3. The server fetches real-time tracking data from Shiprocket API

### API Endpoint
- `GET /api/track-shipment/:awbCode` - Fetches real-time tracking from Shiprocket

### Firebase Security Rules
To enable featured products functionality, add these rules in Firebase Console:
```
match /featuredProducts/{document=**} {
  allow read: if true;
  allow write: if request.auth != null;
}

match /newsletterSubscribers/{document=**} {
  allow read: if request.auth != null;
  allow create: if true;
  allow update, delete: if request.auth != null;
}
```

## Newsletter Integration (Resend)

### Overview
The newsletter system allows visitors to subscribe via the homepage form, and admins can send newsletters through the admin panel.

### Components
- **NewsletterSection** (`src/components/home/NewsletterSection.tsx`) - Frontend subscription form
- **AdminNewsletter** (`src/pages/admin/AdminNewsletter.tsx`) - Admin panel for managing subscribers and sending emails
- **API Endpoint** (`server/index.js`) - `/api/send-newsletter` for sending emails via Resend

### Features
- Email collection with duplicate prevention
- Real-time subscriber list in admin panel
- Search and filter subscribers
- Bulk or individual email selection
- Active/Unsubscribed status toggle
- Send newsletters with custom subject and message
- Beautiful HTML email template

### Configuration
Resend is configured via Replit's integration connector. The API key is automatically managed.

### Security
- Newsletter sending requires Firebase Authentication token
- Only authenticated admins can access the newsletter admin page
- API endpoint validates Bearer token before sending
