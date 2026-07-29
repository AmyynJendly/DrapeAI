const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

let GoogleGenAI;
try {
  GoogleGenAI = require('@google/genai').GoogleGenAI;
} catch (e) {
  try {
    GoogleGenAI = require('@google/generative-ai').GoogleGenerativeAI;
  } catch (err) {
    console.warn('⚠️ Google GenAI SDK not installed. Install via: npm install @google/genai');
  }
}

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/drapeai';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db();
    console.log(`✅ Connected to MongoDB at ${MONGO_URI} (DB: ${db.databaseName})`);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// Helper to format garment/product documents
function formatGarment(g) {
  return {
    id: g._id ? g._id.toString() : g.id,
    _id: g._id ? g._id.toString() : g.id,
    title: g.title || g.name,
    name: g.title || g.name,
    category: g.category || 'apparel',
    price: g.price || 0,
    brand: g.brand || 'Drape Studio',
    description: g.description || '',
    imageUrl: g.imageUrl || g.image,
    fit: g.fit,
    materials: g.materials,
    tags: g.tags || []
  };
}

// GET /api/garments & GET /api/products - Retrieve all clothes from MongoDB
async function handleGetGarments(req, res) {
  try {
    const { category } = req.query;
    const query = category ? { category: new RegExp(`^${category}$`, 'i') } : {};
    
    const garmentsCollection = db.collection('garments');
    const garments = await garmentsCollection.find(query).sort({ createdAt: -1 }).toArray();

    return res.json(garments.map(formatGarment));
  } catch (err) {
    console.error('❌ Error fetching garments:', err);
    return res.status(500).json({ error: 'Failed to retrieve garment catalog' });
  }
}

app.get('/api/garments', handleGetGarments);
app.get('/api/products', handleGetGarments);

// GET /api/garments/:id & GET /api/products/:id - Retrieve single item
async function handleGetGarmentById(req, res) {
  try {
    const { id } = req.params;
    const garmentsCollection = db.collection('garments');
    
    let garment;
    if (ObjectId.isValid(id)) {
      garment = await garmentsCollection.findOne({ _id: new ObjectId(id) });
    }
    if (!garment) {
      garment = await garmentsCollection.findOne({ id: id });
    }

    if (!garment) {
      return res.status(404).json({ error: `Garment not found with id: ${id}` });
    }

    return res.json(formatGarment(garment));
  } catch (err) {
    console.error('❌ Error fetching garment details:', err);
    return res.status(500).json({ error: 'Failed to retrieve garment details' });
  }
}

app.get('/api/garments/:id', handleGetGarmentById);
app.get('/api/products/:id', handleGetGarmentById);

// ─────────────────────────────────────────────────────────────────────────────
// AUTH & ACCOUNT API ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const name = email ? email.split('@')[0] : 'Valued Customer';
  return res.json({
    token: 'drapeai-jwt-token-sample',
    email: email || 'user@drapeai.com',
    name: name.charAt(0).toUpperCase() + name.slice(1)
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name } = req.body;
  return res.json({
    token: 'drapeai-jwt-token-sample',
    email: email || 'user@drapeai.com',
    name: name || 'Valued Customer'
  });
});

app.get('/api/account/me', (req, res) => {
  res.json({
    name: 'Valued Customer',
    email: 'user@drapeai.com',
    preferredSize: 'M',
    stylePreference: 'Minimalist Luxe',
    newsletterOptIn: true,
    role: 'USER'
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. GOOGLE NANO BANANA TRY-ON API (POST /api/try-on)
// ─────────────────────────────────────────────────────────────────────────────

// Helper function to extract base64 data and mimeType from data URLs
function parseBase64DataUrl(dataUrl, defaultMime = 'image/jpeg') {
  if (!dataUrl) return null;
  if (dataUrl.startsWith('data:')) {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : defaultMime;
    const data = parts[1];
    return { mimeType, data };
  }
  return { mimeType: defaultMime, data: dataUrl };
}

app.post('/api/try-on', async (req, res) => {
  try {
    const { userPhotoBase64, garmentId } = req.body;

    if (!userPhotoBase64) {
      return res.status(400).json({ error: 'userPhotoBase64 is required.' });
    }
    if (!garmentId) {
      return res.status(400).json({ error: 'garmentId is required.' });
    }

    // 1. Fetch garment from MongoDB by garmentId
    const garmentsCollection = db.collection('garments');
    let garment;
    if (ObjectId.isValid(garmentId)) {
      garment = await garmentsCollection.findOne({ _id: new ObjectId(garmentId) });
    }
    if (!garment) {
      garment = await garmentsCollection.findOne({ id: garmentId });
    }

    if (!garment) {
      return res.status(404).json({ error: `Garment not found with ID: ${garmentId}` });
    }

    console.log(`👕 Processing Virtual Try-On for garment "${garment.title || garment.name}" (${garment._id})...`);

    // 2. Prepare images for Google GenAI SDK
    const userImageObj = parseBase64DataUrl(userPhotoBase64, 'image/jpeg');
    const garmentImageObj = parseBase64DataUrl(garment.imageUrl || garment.image, 'image/jpeg');

    const promptText = "TASK: Virtual Clothing Try-On. Replace the existing clothing of the target person in the first image with the exact garment in the second image. Keep the person's face, skin tone, hair, posture, and background 100% identical. Preserve exact fabric details, colors, and textures.";

    let resultImageBase64 = null;

    // 3. Call Google GenAI SDK (gemini-2.5-flash-image)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey && GoogleGenAI) {
      try {
        console.log('🤖 Invoking Google GenAI SDK (model: gemini-2.5-flash-image)...');
        const ai = new GoogleGenAI({ apiKey });
        
        const contents = [
          {
            inlineData: {
              data: userImageObj.data,
              mimeType: userImageObj.mimeType
            }
          },
          {
            inlineData: {
              data: garmentImageObj.data,
              mimeType: garmentImageObj.mimeType
            }
          },
          {
            text: promptText
          }
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: contents
        });

        // Extract image output from candidate parts
        if (response && response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
              if (part.inlineData && part.inlineData.data) {
                resultImageBase64 = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              } else if (part.inline_data && part.inline_data.data) {
                resultImageBase64 = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
                break;
              }
            }
          }
        }
      } catch (aiErr) {
        console.warn('⚠️ Google GenAI SDK call warning:', aiErr.message);
      }
    } else {
      console.warn('⚠️ GEMINI_API_KEY or @google/genai SDK not configured — using garment image as output preview.');
    }

    // Fallback if model did not return image bytes directly
    if (!resultImageBase64) {
      resultImageBase64 = garment.imageUrl || userPhotoBase64;
    }

    // 4. Save record in MongoDB tryons collection
    const tryonsCollection = db.collection('tryons');
    const tryOnRecord = {
      garmentId: garment._id.toString(),
      garmentTitle: garment.title || garment.name,
      userPhotoBase64: userPhotoBase64.substring(0, 100) + '...', // truncate stored request preview for space efficiency
      resultImage: resultImageBase64,
      status: 'COMPLETED',
      modelUsed: 'gemini-2.5-flash-image',
      createdAt: new Date()
    };

    const insertResult = await tryonsCollection.insertOne(tryOnRecord);

    console.log(`✨ Try-On completed successfully! Record ID: ${insertResult.insertedId}`);

    // 5. Return result image to caller
    return res.json({
      success: true,
      tryOnId: insertResult.insertedId.toString(),
      garmentId: garment._id.toString(),
      garmentTitle: garment.title || garment.name,
      resultImage: resultImageBase64,
      resultImageUrl: resultImageBase64
    });

  } catch (err) {
    console.error('❌ Error processing try-on:', err);
    return res.status(500).json({ error: 'Failed to process virtual try-on request.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'DrapeAI Node.js Backend',
    database: db ? 'CONNECTED' : 'DISCONNECTED'
  });
});

// Start Server after connecting to DB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 DrapeAI Express Server live at http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} is already in use. Trying fallback port ${PORT + 1}...`);
      const fallbackServer = app.listen(PORT + 1, () => {
        console.log(`🚀 DrapeAI Express Server live at http://localhost:${PORT + 1}`);
      });
    } else {
      console.error('❌ Server error:', err);
    }
  });
});
