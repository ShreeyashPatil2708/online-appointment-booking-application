const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const environment = require('./config/environment');
const dataService = require('./services/dataService');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceProviderRoutes = require('./routes/serviceProviderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: environment.corsOrigin }));

// Rate limiting
const limiter = rateLimit({
  windowMs: environment.rateLimitWindowMs,
  max: environment.rateLimitMax,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (environment.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Swagger documentation
let swaggerDocument;
try {
  swaggerDocument = require('./public/swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch {
  // Swagger not available
}

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/providers', serviceProviderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;

// Start server only when not in test mode
if (require.main === module) {
  const startServer = async () => {
    await dataService.initializeSampleData();
    app.listen(environment.port, () => {
      console.log(`Server running on port ${environment.port} in ${environment.nodeEnv} mode`);
      console.log(`API docs available at http://localhost:${environment.port}/api-docs`);
    });
  };
  startServer();
}
