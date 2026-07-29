const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/drapeai';

// SVG canvas helper converted to Base64 Data URL for guaranteed crisp, CORS-free image loading
function createGarmentBase64(title, category, colorHex, bgHex, accentHex) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <rect width="600" height="800" fill="${bgHex}"/>
    <!-- Subtle fashion backdrop pattern -->
    <circle cx="300" cy="400" r="260" fill="${accentHex}" opacity="0.15"/>
    <rect x="80" y="100" width="440" height="600" rx="30" fill="${colorHex}" opacity="0.95"/>
    
    <!-- Garment silhouette representation -->
    <path d="M 200 200 L 250 160 L 350 160 L 400 200 L 480 260 L 440 340 L 400 310 L 400 660 L 200 660 L 200 310 L 160 340 L 120 260 Z" 
          fill="${accentHex}" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
          
    <!-- Neckline & Collar Details -->
    <path d="M 250 160 C 270 210, 330 210, 350 160" fill="none" stroke="#ffffff" stroke-width="6"/>
    <line x1="300" y1="200" x2="300" y2="400" stroke="#ffffff" stroke-width="3" stroke-dasharray="8,8" opacity="0.6"/>

    <!-- Brand Monogram Tag -->
    <rect x="250" y="600" width="100" height="30" rx="6" fill="#000000" opacity="0.8"/>
    <text x="300" y="620" font-family="serif" font-size="14" font-weight="bold" fill="#E5DAC8" text-anchor="middle" letter-spacing="2">DRAPE.AI</text>

    <!-- Label -->
    <text x="300" y="730" font-family="sans-serif" font-size="22" font-weight="800" fill="#111111" text-anchor="middle" letter-spacing="1">${title.toUpperCase()}</text>
    <text x="300" y="760" font-family="sans-serif" font-size="14" font-weight="600" fill="#555555" text-anchor="middle" letter-spacing="3">${category.toUpperCase()}</text>
  </svg>`;

  const base64Svg = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
}

const garments = [
  {
    title: 'Classic Luxury White Crewneck Tee',
    category: 'apparel',
    imageUrl: createGarmentBase64('Classic White Crewneck', 'Apparel', '#F9F8F6', '#E5DAC8', '#111111'),
    price: 49.00,
    brand: 'ZARA',
    description: 'Tailored luxury crewneck tee crafted from 100% Egyptian Giza cotton with reinforced hems.',
    fit: 'Regular Fit',
    materials: '100% Giza Cotton',
    tags: ['t-shirt', 'white', 'apparel', 'casual'],
    createdAt: new Date()
  },
  {
    title: 'Obsidian Black Leather Biker Jacket',
    category: 'apparel',
    imageUrl: createGarmentBase64('Leather Biker Jacket', 'Apparel', '#1A1A1A', '#D9C4A9', '#C5B299'),
    price: 249.00,
    brand: 'GUCCI',
    description: 'Heavyweight Italian nappa leather motorcycle jacket with brushed silver hardware.',
    fit: 'Slim Fit',
    materials: '100% Full-Grain Nappa Leather',
    tags: ['jacket', 'leather', 'black', 'outerwear'],
    createdAt: new Date()
  },
  {
    title: 'Tailored Indigo Denim Jeans',
    category: 'apparel',
    imageUrl: createGarmentBase64('Indigo Denim Jeans', 'Apparel', '#2B3A4E', '#E5DAC8', '#1C2836'),
    price: 119.00,
    brand: 'VERSACE',
    description: 'Japanese selvedge denim in a deep indigo wash with subtle whiskers and tapered legs.',
    fit: 'Tapered Fit',
    materials: '98% Cotton, 2% Elastane Selvedge',
    tags: ['jeans', 'denim', 'blue', 'bottoms'],
    createdAt: new Date()
  },
  {
    title: 'Emerald Silk Slip Midi Dress',
    category: 'apparel',
    imageUrl: createGarmentBase64('Emerald Silk Dress', 'Apparel', '#0F4C3A', '#E5DAC8', '#1A6B53'),
    price: 210.00,
    brand: 'PRADA',
    description: 'Fluid Mulberry silk bias-cut midi dress with adjustable delicate shoulder straps.',
    fit: 'Bias Cut',
    materials: '100% Mulberry Silk',
    tags: ['dress', 'emerald', 'silk', 'dresses'],
    createdAt: new Date()
  },
  {
    title: 'Oversized Camel Double-Breasted Coat',
    category: 'apparel',
    imageUrl: createGarmentBase64('Camel Wool Coat', 'Apparel', '#C68B59', '#E5DAC8', '#8B5A2B'),
    price: 380.00,
    brand: 'BALENCIAGA',
    description: 'Structured virgin wool and cashmere blend overcoat with dropped shoulders.',
    fit: 'Oversized Fit',
    materials: '90% Virgin Wool, 10% Cashmere',
    tags: ['coat', 'camel', 'wool', 'outerwear'],
    createdAt: new Date()
  },
  {
    title: 'Minimalist Obsidian Leather Chelsea Boots',
    category: 'footwear',
    imageUrl: createGarmentBase64('Obsidian Chelsea Boots', 'Footwear', '#111111', '#E5DAC8', '#444444'),
    price: 195.00,
    brand: 'DIOR',
    description: 'Handcrafted calfskin Chelsea boots with elastic side gussets and stacked leather heels.',
    fit: 'True to Size',
    materials: '100% Calfskin Leather',
    tags: ['boots', 'shoes', 'black', 'footwear'],
    createdAt: new Date()
  }
];

async function seed() {
  const client = new MongoClient(MONGO_URI);
  try {
    console.log(`📡 Connecting to MongoDB at ${MONGO_URI}...`);
    await client.connect();
    const db = client.db();
    
    const garmentsCollection = db.collection('garments');

    console.log('🧹 Clearing existing garments collection...');
    await garmentsCollection.deleteMany({});

    console.log('🌱 Seeding garments with inline Base64 data URLs...');
    const result = await garmentsCollection.insertMany(garments);
    console.log(`✅ Successfully seeded ${result.insertedCount} garments into database "${db.databaseName}"!`);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seed();
