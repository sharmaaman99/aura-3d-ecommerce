# AURA 3D — Ultra-Modern Multi-Category E-Commerce Atelier

An interactive, high-performance 3D Multi-Category E-Commerce website built with real-time 3D perspective physics, specular glare reflections, frosted glassmorphism, dynamic audio feedback, and complete end-to-end shopping cart and checkout architecture.

---

## 🌟 Key Highlights & Architectural Features

### 1. 3D Visual Style & Aesthetics
- **Interactive 3D Hero Section**:
  - Split-screen hero showcase with floating product cards (Luxury Watch, Streetwear Jacket, and Wireless Headphones).
  - Silky 60fps lerped mouse-tilt physics responding across the window.
  - Glowing neon depth rings with orbital rotational dynamics.
  - Floating discount & feature badges with independent Z-depth parallax.
- **3D Perspective Product Cards**:
  - Real-time 3D mouse-tilt physics (`rotateX` / `rotateY` with `perspective: 1000px`).
  - Dynamic specular glare that glides across cards in real-time according to light source angles.
  - Multi-layer `translateZ` depth separation: product images, category tags, wishlist hearts, and action buttons physically pop out of the cards upon hover.
- **Glassmorphism & Color Theme**:
  - **Default Dark Mode**: Deep Obsidian (`#090D16`), Frosted Glass cards (`rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(16px)`), Royal Gold (`#F59E0B`), and Electric Indigo (`#6366F1`) accents.
  - **Light Mode**: Crisp luxury White/Slate aesthetic with frosted glass, deep slate typography, and subtle shadows.
  - Smooth Dark/Light Mode switch in the navbar with `localStorage` persistence.

---

### 2. Pre-Loaded Curated Product Catalog (₹ INR Currency)
Includes 12 premium products (3 per category) with high-res photography, ratings, original vs discounted prices in ₹, and badges:

#### 👕 Category 1 — Clothing
1. **Oversized Streetwear Hoodie** — ₹2,999 (was ₹4,999 • 40% OFF) | *Sizes: S, M, L, XL*
2. **Premium Tailored Blazer** — ₹7,999 (was ₹12,999 • 38% OFF) | *Sizes: 38 (S), 40 (M), 42 (L), 44 (XL)*
3. **Techwear Cargo Jacket** — ₹5,499 (was ₹8,499 • 35% OFF) | *Sizes: S, M, L, XL*

#### ⌚ Category 2 — Luxury Watches
4. **Titanium Chronograph Luxury Watch** — ₹19,999 (was ₹28,999 • 31% OFF) | *Straps: Titanium Metal, Saddle Leather, Midnight Silicone*
5. **Royal Gold Automatic Skeleton Watch** — ₹32,499 (was ₹45,000 • 28% OFF) | *Straps: 18K Gold Metal, Crocodile Leather, Silicone*
6. **AMOLED Smart Fitness Watch** — ₹8,999 (was ₹14,999 • 40% OFF) | *Straps: Silicone Sport, Milanese Metal, Cognac Leather*

#### ⚡ Category 3 — Electronics
7. **Studio ANC Wireless Headphones** — ₹15,999 (was ₹24,999 • 36% OFF) | *Colors: Matte Carbon, Platinum Silver, Midnight Blue*
8. **Ultra-Bass Bluetooth Speaker** — ₹6,999 (was ₹11,999 • 42% OFF) | *Colors: Deep Stealth, Blaze Orange, Military Olive*
9. **Next-Gen VR/AR Smart Glasses** — ₹36,999 (was ₹49,999 • 26% OFF) | *Colors: Cyber Tint, Clear Optical*

#### 🕶️ Category 4 — Fashion & Accessories
10. **Polarized Designer Sunglasses** — ₹3,999 (was ₹6,999 • 43% OFF) | *Colors: Gold/Emerald, Matte Black, Havana Tortoise*
11. **Limited-Edition High-Top Sneakers** — ₹10,999 (was ₹16,999 • 35% OFF) | *Sizes: UK 7, UK 8, UK 9, UK 10, UK 11*
12. **Italian Leather Crossbody Bag** — ₹11,499 (was ₹18,499 • 38% OFF) | *Colors: Tuscan Cognac, Espresso Black, Olive Suede*

---

### 3. Full E-Commerce Functionality
- **Live Filtering, Search & Sorting**:
  - Instant category filtering (All, Clothing, Watches, Electronics, Fashion).
  - Real-time search query matching product titles, descriptions, and tags.
  - Sorting by Featured, Price (Low to High), Price (High to Low), and Top Rated.
- **3D Product Quick-View Modal**:
  - Interactive 3D tilt stage for product imagery.
  - Dynamic variant selector (sizes, straps, colorway swatches).
  - Technical specifications, stock indicators, quantity stepper, and "Buy Now" shortcut.
- **Slide-Out Shopping Cart Drawer**:
  - Live variant and quantity adjustments (`+` / `-` / remove).
  - Dynamic Free Shipping progress indicator.
  - **Working Coupon System**: Entering promo code **`SAVE20`** applies a 20% discount with instant visual and sound feedback.
  - Clear Subtotal, GST, and Grand Total calculation.
- **Wishlist Vault**:
  - Heart icon toggling on cards and modals with animated counter badge in navbar.
  - Full `localStorage` persistence and dedicated Wishlist drawer.
- **Complete Checkout & Order Tracking**:
  - Customer shipping credentials form (Full Name, Phone, Address, Pincode).
  - Multiple payment choices: **UPI / QR** (with dynamic simulated QR code), **Credit/Debit Card**, and **Cash on Delivery**.
  - Animated **Order Confirmed** screen with celebratory confetti, delivery estimation, and unique **Order Tracking ID** (e.g. `#TRK-98421`).

---

## 🚀 Running The Application Locally

You can launch and test the website using any of the following methods:

### Option 1: Direct File Open
Double click `index.html` in your file explorer or open it directly in Chrome, Safari, Firefox, or Edge.

### Option 2: Local HTTP Server (Recommended)
```bash
# Using Python
python3 -m http.server 3000

# OR using Node / npx
npx serve . -l 3000
```
Then visit `http://localhost:3000` in your browser.

---

## 📁 File Structure

```
EcomersWebsite/
├── index.html            # Main semantic HTML5 document with modals & sections
├── package.json          # Project metadata and quick start scripts
├── README.md             # Project documentation
├── css/
│   └── styles.css        # Glassmorphic design system, 3D physics styles, dark/light themes
└── js/
    ├── products.js       # Pre-loaded catalog with 12 INR items & specifications
    ├── cart.js           # Shopping cart, wishlist, and coupon state manager
    ├── tilt3d.js         # 3D mouse-tilt physics, specular glare, and hero 3D stage
    ├── audio.js          # Synthesized Web Audio API sensory click and chime feedback
    └── app.js            # App orchestrator, filters, quick view, checkout & order tracking
```
