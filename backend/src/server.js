const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

connectDB();

const app = express();

// const defaultOrigins = [
//   'http://localhost:5173',
//   'http://localhost:3000',
//   'http://127.0.0.1:5173',
//   'http://localhost:5174',
//   'http://127.0.0.1:5174',
//   'https://kar-zone.vercel.app',
//   'https://karzone.onrender.com',
// ];
// const envOrigins = (process.env.ALLOWED_ORIGINS || '')
//   .split(',')
//   .map(s => s.trim())
//   .filter(Boolean);
// const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     if (process.env.NODE_ENV === 'production') {
//       console.log(`⚠️  CORS rejected origin: ${origin}`);
//       return callback(new Error('Not allowed by CORS'));
//     }
//     console.log(`⚠️  CORS allowed (dev) unknown origin: ${origin}`);
//     return callback(null, true);
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(cors(
  {
    origin:'*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
))

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to KARZONE API',
    version: '1.0.0',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Server listening on all interfaces (0.0.0.0:${PORT})`);
});
