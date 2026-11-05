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
    console.error('❌ MongoDB Configuration Error: Neither MONGO_URI nor MONGODB_URI found in environment or server/.env');
    throw new Error('MONGO_URI is missing from server/.env');
  }

  // Validate connection string protocol
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI Format: URI must begin with "mongodb://" or "mongodb+srv://"');
    throw new Error('Invalid MongoDB connection string protocol.');
  }

  // Check for lingering placeholder brackets
  if (mongoUri.includes('<') || mongoUri.includes('>')) {
    console.warn('⚠️ Warning: MongoDB URI contains angle brackets ("<" or ">"). Ensure you have replaced placeholders like <username> or <password> with your actual Atlas credentials.');
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for Atlas
    });

    console.log('✅ MongoDB connected successfully!');
    globalThis.__LMS_DEMO_MODE__ = false;
    return true;
  } catch (error) {
    const safeErrorMsg = sanitizeMessage(error.message);
    console.error('\n======================================================');
    console.error('❌ MongoDB Atlas Connection Failed!');
    console.error(`   Error Name:    ${error.name}`);
    console.error(`   Error Message: ${safeErrorMsg}`);
    if (error.code) console.error(`   Error Code:    ${error.code}`);
    if (error.codeName) console.error(`   Code Name:     ${error.codeName}`);

    // Help diagnose common MongoDB Atlas issues
    if (safeErrorMsg.includes('bad auth') || safeErrorMsg.includes('Authentication failed')) {
      console.error('\n   💡 Diagnosis: Authentication failed.');
      console.error('      - Verify your MongoDB Atlas Database Username and Password.');
      console.error('      - Check in Atlas under: "Security" -> "Database Access".');
      console.error('      - Ensure no angle brackets "<" or ">" surround username/password.');
    } else if (safeErrorMsg.includes('whitelist') || safeErrorMsg.includes('Could not connect to any servers') || safeErrorMsg.includes('ETIMEDOUT') || safeErrorMsg.includes('ENOTFOUND')) {
      console.error('\n   💡 Diagnosis: Network / IP Access issue.');
      console.error('      - Verify your current IP address is whitelisted in MongoDB Atlas.');
      console.error('      - Check in Atlas under: "Security" -> "Network Access".');
      console.error('      - For development, you can add "0.0.0.0/0" (Allow access from anywhere).');
    }
    console.error('======================================================\n');

    // Do not replace with in-memory storage silently; rethrow so server halts with visible error
    throw error;
  }
};

export default connectDB;
