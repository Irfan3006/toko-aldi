# Toko Aldi Sembako Web Application

## Overview
Toko Aldi Sembako is a web application for a grocery store located in Banguntapan, Bantul, Yogyakarta. Built with Astro, Bootstrap, and Google Apps Script, the application combines a customer-facing storefront landing page with an integrated content management and blogging system.

## Key Features

### Storefront Landing Page
* **Hero Section**: Displays primary store branding with direct action buttons for immediate WhatsApp messaging and Google Maps navigation.
* **Store Overview**: Presents detailed business information, core values, and store services.
* **Operating Hours Display**: Highlights daily store schedules (Monday through Sunday, 06:30 to 23:00 WIB).
* **Interactive Location Map**: Features an embedded, responsive Google Maps interface enabling customers to pinpoint store coordinates and obtain turn-by-turn navigation.
* **Supported Payment Options**: Clearly outlines available payment channels, including cash transactions and QRIS digital payments.
* **Promotional Deals Banner**: Showcases active grocery discounts, special package offers, and seasonal pricing updates.
* **Customer Reviews and Media Coverage**: Displays customer testimonials along with press citations from external platforms such as Google Maps and Medium.
* **Global Contact Footer**: Integrates comprehensive store contact details, location addresses, and direct WhatsApp communication links.

### Content Management and Blog System
* **Dynamic Article Portal**: Displays published grocery guides, shopping tips, store announcements, and promotional articles.
* **Article Reader and Detail View**: Supports rich text rendering, estimated reading time, author profiles, related content recommendations, social media sharing, and dynamic metadata.
* **Category Filtering**: Categorizes published posts into dedicated channels for streamlined topic navigation.
* **Search and Exploration Engine**: Enables full-text search across article titles, contents, and categories with pagination support.
* **User Authentication System**: Provides registration and authentication pipelines for authors and administrators.
* **Author Dashboard and Profile Management**: Allows registered writers to track published articles, manage profile details, and review author metrics.
* **Interactive Content Creator**: Offers a dedicated interface for drafting, editing, previewing, and managing post content.
* **Administrative Control Panel**: Provides administrators with moderation tools to review, approve, edit, or remove draft and published articles.

### Technical and SEO Architecture
* **Server-Side Rendering (SSR)**: Configured with Astro v5 and the Vercel serverless deployment adapter for optimal server runtime performance.
* **Search Engine Optimization**: Implements semantic HTML5 elements, custom titles, targeted meta descriptions, canonical URLs, and automated sitemap generation via `@astrojs/sitemap`.
* **Structured Data (Schema.org)**: Integrates `LocalBusiness` and `GroceryStore` JSON-LD schema markup to enhance search engine visibility and rich result snippets.
* **Performance Optimizations**: Utilizes lazy-loading techniques for external resources, media assets, and maps alongside resource prefetching (`preconnect` and `dns-prefetch`).
* **Responsive Layout**: Designed mobile-first using Bootstrap 5 and custom style systems for cross-device compatibility.

## Tech Stack
* **Framework**: Astro 5 (Server-Side Rendering mode)
* **Deployment & Server Adapter**: Vercel (`@astrojs/vercel`)
* **Styling**: Bootstrap 5, Custom CSS
* **Backend & Database Service**: Google Apps Script API integration
* **Integrations**: `@astrojs/sitemap`
* **Language & Tooling**: TypeScript, JavaScript (ES modules), Node.js, pnpm

## Summary
This application delivers a high-performance web platform combining local retail marketing with a content management system.

Developed by [Irfan Syarifudin](https://irfansyarifudin.my.id).
