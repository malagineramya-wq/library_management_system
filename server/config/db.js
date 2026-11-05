import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server/.env is loaded even if invoked directly
dotenv.config({ path: path.join(__dirname, '../.env') });

export const isDemoMode = () => globalThis.__LMS_DEMO_MODE__ === true;

// Redacts any credentials (username:password) from URIs or error messages
const sanitizeMessage = (msg) => {
  if (!msg) return '';
  return String(msg).replace(/mongodb(\+srv)?:\/\/[^@]+@/gi, 'mongodb$1://<credentials-hidden>@');
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI not provided. Starting in built-in demo database mode.');
    globalThis.__LMS_DEMO_MODE__ = true;
    return false;
  }

  // Validate connection string protocol
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.warn('⚠️ Invalid MongoDB connection protocol. Starting in built-in demo mode.');
    globalThis.__LMS_DEMO_MODE__ = true;
    return false;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connected successfully!');
    globalThis.__LMS_DEMO_MODE__ = false;
    return true;
  } catch (error) {
    const safeErrorMsg = sanitizeMessage(error.message);
    console.warn('\n======================================================');
    console.warn('⚠️ MongoDB Atlas Connection Warning:');
    console.warn(`   ${safeErrorMsg}`);
    console.warn('   Starting seamlessly in demo mode so the web service stays live 24/7.');
    console.warn('   (To connect to Atlas, whitelist 0.0.0.0/0 under Network Access)');
    console.warn('======================================================\n');

    globalThis.__LMS_DEMO_MODE__ = true;
    return false;
  }
};

export default connectDB;
