# TempWeb Website Requirements Document

## 1. Website Overview
### 1.1 Website Name
TempWeb

### 1.2 Website Description
A professional web development service platform offering HTML/CSS/JS website creation services, featuring service packages, portfolio showcase, and direct client communication channels.

### 1.3 Core Functionality
- Service package browsing and purchasing system
- Payment processing integration
- Portfolio template gallery
- Client request submission system
- User authentication and login\n- Dark/Light mode toggle with live UI/UX switching

## 2. Website Structure
\n### 2.1 Header Section
- Logo: TempWeb branding logo positioned on the left\n- Navigation menu: Store Zone, Template Zone, Request Zone\n- Dark/Light mode toggle button with real-time theme switching
- Login button for customer authentication

### 2.2 Store Zone
- Display service packages and offers:\n  * Basic Package: Simple HTML/CSS/JS website (1-3 pages)
  * Standard Package: Responsive website with interactive features (5-8 pages)
  * Premium Package: Custom-designed website with advanced functionality (10+ pages)
  * Maintenance Plan: Monthly website updates and support
- Discount badges for promotional offers
- 'Buy Now' buttons linking to payment page

### 2.3 Payment Page
- Integrated payment gateway: Stripe\n- Secure checkout form with:\n  * Package selection summary
  * Customer billing information
  * Credit card payment processing
  * Order confirmation\n\n### 2.4 Template Zone (Middle Section)
- Gallery showcasing screenshots of previously created websites
- Grid layout displaying portfolio samples
- Hover effects revealing project details
- Responsive image display\n
### 2.5 Request Zone (Bottom Section)
- Client inquiry section\n- 'Request Now' button triggering contact form
- Contact form fields:\n  * Name
  * Email address
  * Project description
  * Budget range\n- Form submission sends message to: contact@tempweb.com

### 2.6 Login System
- User registration via email
- Login authentication\n- Customer dashboard for:\n  * Order history
  * Direct messaging with service provider
  * Project status tracking
\n## 3. Design Style

### 3.1 Color Scheme
- Light Mode: Primary color #2563EB (modern blue), background #FFFFFF, text #1F2937
- Dark Mode: Primary color #3B82F6 (bright blue), background #111827, text #F9FAFB
- Accent color: #10B981 (success green) for CTAs and highlights

### 3.2 Visual Details
- Border radius: 8px for cards and buttons, 12px for modal windows
- Shadow effects: Subtle elevation shadows (04px 6px rgba(0,0,0,0.1)) for depth
- Icon style: Outlined modern icons with 2px stroke width
- Smooth transitions: 0.3s ease-in-out for theme switching and hover states

### 3.3 Layout Structure
- Card-based layout for Store Zone packages
- Grid layout (3 columns on desktop, 1 column on mobile) for Template Zone
- Sticky header with transparent-to-solid background on scroll
- Responsive design with mobile-first approach

### 3.4 Typography
- Headings: Bold, modern sans-serif font with clear hierarchy
- Body text: Clean, readable font with 1.6line-height for optimal readability