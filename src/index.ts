/* eslint-disable @typescript-eslint/no-require-imports */
// Using require() deliberately so dotenv loads BEFORE any other module
const dotenv = require('dotenv') as typeof import('dotenv');
try {
  const result = dotenv.config();
  if (result.error) {
    console.log('ℹ️  No .env file found — using environment variables from host');
  } else {
    console.log(`ℹ️  Loaded ${Object.keys(result.parsed ?? {}).length} vars from .env`);
  }
} catch (e) {
  console.log('ℹ️  dotenv.config() threw — using host env vars:', e);
}

console.log('✔ Step 1: dotenv done');
console.log('  PORT:', process.env.PORT ?? '(not set)');
console.log('  MONGO_URI:', process.env.MONGO_URI ? '(set)' : '(NOT SET)');
console.log('  NODE_ENV:', process.env.NODE_ENV ?? '(not set)');

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

console.log('✔ Step 2: core modules loaded');

import authRoutes from './routes/authRoute';
import groupRoutes from './routes/groupRoute';
import expenseRoutes from './routes/expenseRoute';
import settlementRoutes from './routes/settlementRoute';

console.log('✔ Step 3: route modules loaded');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/settlements', settlementRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Smart Expense Splitter API is running ✅', env: process.env.NODE_ENV });
});

// ── Start ─────────────────────────────────────────────────────────────────────
console.log('✔ Step 4: app configured, starting server...');

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI not set — skipping DB connection.');
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB');
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
