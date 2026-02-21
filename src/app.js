const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const componentRoutes = require('./routes/componentRoutes');
const configRoutes = require('./routes/configRoutes');

app.use('/api/users', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/configurations', configRoutes);

// Swagger
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.error('Swagger load error:', error);
}

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
