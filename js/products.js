/**
 * Luxury & Modern 3D E-Commerce Product Catalog
 * Pre-loaded with 12 premium products across 4 categories
 * Currency: INR (₹)
 */

const PRODUCTS_DATA = [
  // --- CATEGORY 1: CLOTHING ---
  {
    id: "prod-hoodie-01",
    name: "Oversized Streetwear Hoodie",
    category: "clothing",
    categoryLabel: "Clothing",
    badge: "Bestseller",
    badgeType: "trending",
    price: 2999,
    originalPrice: 4999,
    discountPercent: 40,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 8,
    description: "Architected for the modern streetwear connoisseur. Featuring a heavyweight 480 GSM French Terry drape, drop-shoulder geometry, and double-layered thermal hood. Built to endure seasons with pre-shrunk organic cotton yarn.",
    variantType: "size",
    variants: ["S", "M", "L", "XL"],
    colors: [
      { name: "Obsidian Black", hex: "#111827" },
      { name: "Sage Green", hex: "#4b5563" },
      { name: "Heather Ash", hex: "#9ca3af" }
    ],
    specs: [
      "480 GSM Heavyweight French Terry Cotton",
      "Ergonomic Drop-Shoulder Relaxed Silhouette",
      "Double-Lined Thermal Construction",
      "Reinforced Ribbed Cuffs and Hem"
    ],
    features: ["Pre-shrunk organic yarn", "Concealed kangaroo pocket", "Custom engraved eyelets"]
  },
  {
    id: "prod-blazer-02",
    name: "Premium Tailored Blazer",
    category: "clothing",
    categoryLabel: "Clothing",
    badge: "Luxury Drop",
    badgeType: "luxury",
    price: 7999,
    originalPrice: 12999,
    discountPercent: 38,
    rating: 4.8,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 5,
    description: "Sartorial elegance meeting contemporary precision. Spun from Super 120s Italian Merino wool blend with structured peak lapels and hand-finished pick-stitching. Features breathable Bemberg cupro lining.",
    variantType: "size",
    variants: ["38 (S)", "40 (M)", "42 (L)", "44 (XL)"],
    colors: [
      { name: "Midnight Navy", hex: "#1e293b" },
      { name: "Charcoal Slate", hex: "#334155" },
      { name: "Camel Tan", hex: "#b45309" }
    ],
    specs: [
      "Super 120s Italian Wool Blend Shell",
      "Breathable Bemberg Cupro Interior Lining",
      "Hand-Finished Peak Lapel Details",
      "Concealed Internal Passport Travel Pocket"
    ],
    features: ["Natural horn buttons", "Double back vent for mobility", "Crease-resistant weave"]
  },
  {
    id: "prod-jacket-03",
    name: "Techwear Cargo Jacket",
    category: "clothing",
    categoryLabel: "Clothing",
    badge: "Trending",
    badgeType: "trending",
    price: 5499,
    originalPrice: 8499,
    discountPercent: 35,
    rating: 4.9,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 12,
    description: "Engineered for harsh urban climates. Constructed from hydrophobic diamond-weave ripstop with modular Fidlock magnetic buckles, sealed storm seams, and 8 quick-access tactical cargo pockets.",
    variantType: "size",
    variants: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cyber Shadow", hex: "#0f172a" },
      { name: "Olive Drab", hex: "#3f4931" },
      { name: "Arctic White", hex: "#e2e8f0" }
    ],
    specs: [
      "DWR 20,000mm Waterproof & Breathable Membrane",
      "German-Engineered Magnetic Quick-Release Buckles",
      "8 Ergonomic Multipurpose Utility Pockets",
      "YKK Aquaguard Hydrophobic Zippers"
    ],
    features: ["Removable storm hood", "Reflective 3M safety accents", "Adjustable articulated elbows"]
  },

  // --- CATEGORY 2: WATCHES ---
  {
    id: "prod-watch-01",
    name: "Titanium Chronograph Luxury Watch",
    category: "watches",
    categoryLabel: "Watches",
    badge: "Limited Edition",
    badgeType: "gold",
    price: 19999,
    originalPrice: 28999,
    discountPercent: 31,
    rating: 5.0,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 4,
    description: "An aerospace marvel on your wrist. Forged in ultra-durable Grade 5 titanium with a triple sub-dial chronograph, anti-reflective sapphire crystal glass, and precision meca-quartz sweep caliber.",
    variantType: "strap",
    variants: ["Brushed Titanium Metal", "Italian Saddle Leather", "Midnight Silicone"],
    colors: [
      { name: "Obsidian Titanium", hex: "#374151" },
      { name: "Rose Gold Accent", hex: "#b45309" }
    ],
    specs: [
      "Grade 5 Aerospace-Grade Titanium Case (42mm)",
      "Double-Domed Sapphire Crystal with AR Coating",
      "100m Water Resistance (10 ATM)",
      "Hybrid Meca-Quartz Chronograph Movement"
    ],
    features: ["Super-LumiNova BGW9 luminous hands", "Screw-down crown with engraved emblem", "Ceramic tachymeter bezel"]
  },
  {
    id: "prod-watch-02",
    name: "Royal Gold Automatic Skeleton Watch",
    category: "watches",
    categoryLabel: "Watches",
    badge: "Masterpiece",
    badgeType: "gold",
    price: 32499,
    originalPrice: 45000,
    discountPercent: 28,
    rating: 4.9,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 3,
    description: "Pure horological artistry. An open-heart skeleton dial reveals the 24-jewel self-winding mechanical heartbeat. Layered in 18K royal gold PVD over marine-grade stainless steel with 42-hour power reserve.",
    variantType: "strap",
    variants: ["18K PVD Gold Metal", "Hand-Stitched Leather", "High-Density Silicone"],
    colors: [
      { name: "18K Royal Gold", hex: "#f59e0b" },
      { name: "Platinum Gunmetal", hex: "#475569" }
    ],
    specs: [
      "24-Jewel Self-Winding Mechanical Movement",
      "Exhibition Skeleton Caseback with 42h Power Reserve",
      "Marine-Grade 316L Stainless Steel Core",
      "50m Splash & Rain Resistance (5 ATM)"
    ],
    features: ["No battery needed - powered by kinetic motion", "Jeweled balance wheel visible from front", "Butterfly deployment clasp"]
  },
  {
    id: "prod-watch-03",
    name: "AMOLED Smart Fitness Watch",
    category: "watches",
    categoryLabel: "Watches",
    badge: "Tech Pick",
    badgeType: "tech",
    price: 8999,
    originalPrice: 14999,
    discountPercent: 40,
    rating: 4.7,
    reviewsCount: 320,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 15,
    description: "Next-gen wellness intelligence. Boasts an ultra-bright 1.43-inch Always-On AMOLED screen, continuous SpO2 and optical heart telemetry, dual-band GPS, and 14 days of battery longevity.",
    variantType: "strap",
    variants: ["Midnight Silicone", "Magnetic Milanese Metal", "Vintage Leather"],
    colors: [
      { name: "Space Grey", hex: "#1f2937" },
      { name: "Alpine Blue", hex: "#2563eb" },
      { name: "Starlight Gold", hex: "#d97706" }
    ],
    specs: [
      "1.43\" Ultra-HD AMOLED Display (1000 nits peak)",
      "Dynamic ECG, Optical Heart Rate & Blood Oxygen Sensor",
      "14-Day Military Battery Life with Fast Charge",
      "Integrated Dual-Frequency GPS & Bluetooth HD Calling"
    ],
    features: ["120+ Sports Tracking Modes", "Sleep quality & stress analytics", "Waterproof 5ATM swim-proof rating"]
  },

  // --- CATEGORY 3: ELECTRONICS ---
  {
    id: "prod-elec-01",
    name: "Studio ANC Wireless Headphones",
    category: "electronics",
    categoryLabel: "Electronics",
    badge: "Pro Audio",
    badgeType: "tech",
    price: 15999,
    originalPrice: 24999,
    discountPercent: 36,
    rating: 4.9,
    reviewsCount: 185,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 7,
    description: "Acoustic transcendence. Custom 40mm Beryllium drivers tuned by Grammy-winning sound engineers deliver crisp highs and punchy sub-bass. Features 45dB hybrid ANC and ultra-plush memory foam cushions.",
    variantType: "color",
    variants: ["Matte Carbon", "Platinum Silver", "Midnight Blue"],
    colors: [
      { name: "Matte Carbon", hex: "#18181b" },
      { name: "Platinum Silver", hex: "#cbd5e1" },
      { name: "Midnight Blue", hex: "#1e3a8a" }
    ],
    specs: [
      "40mm Custom Electrostatic Beryllium Transducers",
      "Hybrid 45dB Active Noise Cancellation with Transparency",
      "50-Hour Continuous Playback (10-min charge = 5 hours)",
      "Lossless LDAC, aptX Adaptive & Spatial Audio with Head-Tracking"
    ],
    features: ["Quad-beamforming microphones with AI noise suppression", "Foldable aerospace alloy hinges", "Companion EQ sound tuning app"]
  },
  {
    id: "prod-elec-02",
    name: "Ultra-Bass Bluetooth Speaker",
    category: "electronics",
    categoryLabel: "Electronics",
    badge: "Party Beast",
    badgeType: "trending",
    price: 6999,
    originalPrice: 11999,
    discountPercent: 42,
    rating: 4.8,
    reviewsCount: 115,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 10,
    description: "Massive acoustic power anywhere. Dual neodymium woofers and twin passive radiators push 60W RMS of earth-shaking 360-degree bass. Certified IPX7 waterproof and ruggedized for outdoor adrenaline.",
    variantType: "color",
    variants: ["Deep Stealth", "Blaze Orange", "Military Olive"],
    colors: [
      { name: "Deep Stealth", hex: "#0f172a" },
      { name: "Blaze Orange", hex: "#ea580c" },
      { name: "Military Olive", hex: "#365314" }
    ],
    specs: [
      "60W RMS Dual Neodymium Subwoofers & Tweeters",
      "IPX7 Fully Submersible Waterproof Housing",
      "360° Omnidirectional Room-Filling Acoustic Waveguide",
      "24-Hour Non-stop Playback with USB-C Powerbank Output"
    ],
    features: ["TWS Dual Speaker Stereo Pairing", "Dynamic rhythm beat LED lighting rings", "Shock-absorbent rubberized bumpers"]
  },
  {
    id: "prod-elec-03",
    name: "Next-Gen VR/AR Smart Glasses",
    category: "electronics",
    categoryLabel: "Electronics",
    badge: "Spatial Future",
    badgeType: "tech",
    price: 36999,
    originalPrice: 49999,
    discountPercent: 26,
    rating: 4.8,
    reviewsCount: 73,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 6,
    description: "Step into the spatial computing frontier. Dual Sony Micro-OLED displays beam a 200-inch virtual cinema with 120Hz refresh rate directly in front of your vision. Featherlight 72g frame fits like ordinary spectacles.",
    variantType: "color",
    variants: ["Cyber Tint", "Clear Optical"],
    colors: [
      { name: "Cyber Tint", hex: "#1e1b4b" },
      { name: "Clear Optical", hex: "#475569" }
    ],
    specs: [
      "Dual Sony Micro-OLED Displays (FHD per eye, 120Hz)",
      "Virtual 200\" Cinema FOV at 4-meter perceived distance",
      "Acoustic Directional Stereo Micro-Speakers (Private Audio)",
      "Featherlight 72g Ergonomic Titanium & TR90 Chassis"
    ],
    features: ["Plug-and-play with iPhone 15/16, Mac, Windows, SteamDeck", "TÜV Rheinland certified eye comfort", "Adjustable magnetic diopter prescription clips"]
  },

  // --- CATEGORY 4: FASHION ACCESSORIES ---
  {
    id: "prod-fash-01",
    name: "Polarized Designer Sunglasses",
    category: "fashion",
    categoryLabel: "Fashion",
    badge: "UV400 Polarized",
    badgeType: "luxury",
    price: 3999,
    originalPrice: 6999,
    discountPercent: 43,
    rating: 4.8,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 14,
    description: "Timeless geometric Italian silhouette. Carved from hypoallergenic Mazzucchelli acetate with 9-layer TAC polarized lenses that eliminate blinding glare while enriching color contrast and depth.",
    variantType: "color",
    variants: ["Gold Frame / Green Lens", "Matte Black / Smoke", "Tortoise Shell"],
    colors: [
      { name: "Gold / Emerald", hex: "#ca8a04" },
      { name: "Matte Black", hex: "#18181b" },
      { name: "Havana Tortoise", hex: "#78350f" }
    ],
    specs: [
      "9-Layer Triacetate Cellulose (TAC) Polarized Optical Lenses",
      "100% UV400 Filtering (UVA, UVB, UVC Radiation)",
      "Hand-Polished Italian Mazzucchelli Cellulose Acetate",
      "German Monobloc 5-Barrel Precision Barrel Hinges"
    ],
    features: ["Hydrophobic and oleophobic anti-scratch coating", "Includes genuine leather folding case & microfiber cloth", "Ultra-balanced weight distribution"]
  },
  {
    id: "prod-fash-02",
    name: "Limited-Edition High-Top Sneakers",
    category: "fashion",
    categoryLabel: "Fashion",
    badge: "Hype Drop",
    badgeType: "trending",
    price: 10999,
    originalPrice: 16999,
    discountPercent: 35,
    rating: 4.9,
    reviewsCount: 240,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 9,
    description: "The crown jewel of street luxury footwear. Features buttery full-grain nappa leather, hand-distressed suede overlays, nitrogen-cushioned midsole pods, and serialized limited collector certification.",
    variantType: "size",
    variants: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    colors: [
      { name: "Neon Cyber", hex: "#6366f1" },
      { name: "Retro Cream", hex: "#fde68a" },
      { name: "Stealth Black", hex: "#0f172a" }
    ],
    specs: [
      "Full-Grain Italian Nappa Leather & Suede Panels",
      "Nitrogen-Infused Energy Return Cushioning Midsole",
      "High-Traction Vulcanized Gum Outsole with Pivot Circles",
      "Antibacterial OrthoLite Moisture-Wicking Insole"
    ],
    features: ["Individually numbered metal tongue tag", "Includes 3 sets of premium waxed laces", "Collector magnetic-latch luxury shoebox"]
  },
  {
    id: "prod-fash-03",
    name: "Italian Leather Crossbody Bag",
    category: "fashion",
    categoryLabel: "Fashion",
    badge: "Artisan Handcrafted",
    badgeType: "luxury",
    price: 11499,
    originalPrice: 18499,
    discountPercent: 38,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    stockCount: 6,
    description: "Masterful Italian leather craftsmanship. Handcrafted in Florence from vegetable-tanned Vachetta leather that develops a magnificent personalized patina over time. Equipped with solid brushed brass hardware.",
    variantType: "color",
    variants: ["Tuscan Cognac", "Espresso Black", "Olive Suede"],
    colors: [
      { name: "Tuscan Cognac", hex: "#9a3412" },
      { name: "Espresso Black", hex: "#1c1917" },
      { name: "Olive Suede", hex: "#3f4931" }
    ],
    specs: [
      "Certified Tuscan Full-Grain Vegetable-Tanned Cowhide",
      "Solid Antique Brushed Brass Buckles & Hardware",
      "Padded 11-inch Tablet / iPad Sleeve Compartment",
      "Adjustable Reinforced Ergonomic Shoulder Strap"
    ],
    features: ["Quick-access magnetic rear passport pouch", "Interior key lanyard with solid brass clip", "Dust bag included"]
  }
];

// Helper to format currency in Indian Rupee format (₹)
function formatINR(amount) {
  if (isNaN(amount)) return "₹0";
  return "₹" + Number(amount).toLocaleString("en-IN");
}
