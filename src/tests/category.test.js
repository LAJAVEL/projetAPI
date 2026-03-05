const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

jest.setTimeout(30000);

const withDbName = (baseUri, dbName) => {
  const [beforeQuery, query] = String(baseUri).split('?');
  const parts = beforeQuery.split('/');
  if (parts.length >= 4 && parts[0].startsWith('mongodb')) {
    parts[parts.length - 1] = dbName;
    return `${parts.join('/')}${query ? `?${query}` : ''}`;
  }
  return `${beforeQuery.replace(/\/$/, '')}/${dbName}${query ? `?${query}` : ''}`;
};

const getCandidateMongoUris = () => {
  const dbName = 'configurateur_pc_test';
  const candidates = [];
  if (process.env.MONGO_TEST_URI) candidates.push(process.env.MONGO_TEST_URI);
  if (process.env.MONGO_URI) candidates.push(withDbName(process.env.MONGO_URI, dbName));
  candidates.push(`mongodb://127.0.0.1:27017/${dbName}`);
  return [...new Set(candidates.filter(Boolean))];
};

const connectTestDb = async () => {
  const candidates = getCandidateMongoUris();
  let lastError;
  for (const uri of candidates) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
      return;
    } catch (err) {
      lastError = err;
      try {
        await mongoose.disconnect();
      } catch {
      }
    }
  }
  throw lastError;
};

let adminToken;
let userToken;
let categoryId;
let partnerId;
let componentId;
let configId;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

  // Ensure we are connected
  if (mongoose.connection.readyState === 0) {
    await connectTestDb();
  }
  
  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });

  const res = await request(app)
    .post('/api/users/login')
    .send({
      email: 'admin@example.com',
      password: 'password123'
    });
    
  adminToken = res.body.token;

  await request(app)
    .post('/api/users/register')
    .send({
      name: 'User',
      email: 'user@example.com',
      password: 'password123'
    });

  const userLogin = await request(app)
    .post('/api/users/login')
    .send({
      email: 'user@example.com',
      password: 'password123'
    });

  userToken = userLogin.body.token;
});

afterAll(async () => {
  if (mongoose.connection?.readyState === 1 && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  if (mongoose.connection?.readyState) {
    await mongoose.connection.close();
  }
});

describe('Category API', () => {
  it('should create a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'CPU',
        description: 'Processors'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('CPU');
    categoryId = res.body._id;
  });

  it('should get all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a category (admin)', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Processors (updated)' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toContain('updated');
  });
});

describe('Partners API', () => {
  it('should create a partner (admin)', async () => {
    const res = await request(app)
      .post('/api/partners')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Shop', websiteUrl: 'https://example.com' });
    expect(res.statusCode).toEqual(201);
    partnerId = res.body._id;
  });

  it('should list partners (public)', async () => {
    const res = await request(app).get('/api/partners');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a partner (admin)', async () => {
    const res = await request(app)
      .put(`/api/partners/${partnerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Shop Updated' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toContain('Updated');
  });
});

describe('Components API', () => {
  it('should create a component (admin)', async () => {
    const res = await request(app)
      .post('/api/components')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category: categoryId,
        brand: 'Intel',
        title: 'Core i7',
        model: '14700K',
        description: 'CPU',
        prices: [{ partner: partnerId, price: 650 }],
      });
    expect(res.statusCode).toEqual(201);
    componentId = res.body._id;
  });

  it('should list components (public)', async () => {
    const res = await request(app).get('/api/components');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get component details (public)', async () => {
    const res = await request(app).get(`/api/components/${componentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(componentId);
  });

  it('should update a component (admin)', async () => {
    const res = await request(app)
      .put(`/api/components/${componentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Core i7 Updated' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toContain('Updated');
  });
});

describe('Configurations API', () => {
  it('should access user profile (private)', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('user@example.com');
  });

  it('should create a configuration (user)', async () => {
    const res = await request(app)
      .post('/api/configurations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'My PC',
        components: [{ component: componentId, priceAtTime: 650, quantity: 1 }],
      });
    expect(res.statusCode).toEqual(201);
    configId = res.body._id;
  });

  it('should get my configurations (user)', async () => {
    const res = await request(app)
      .get('/api/configurations/my')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should export configuration PDF (user)', async () => {
    const res = await request(app)
      .get(`/api/configurations/${configId}/pdf`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(String(res.headers['content-type'])).toContain('application/pdf');
  });

  it('should update a configuration (user)', async () => {
    const res = await request(app)
      .put(`/api/configurations/${configId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'My PC Updated',
        components: [{ component: componentId, priceAtTime: 650, quantity: 1 }],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toContain('Updated');
  });

  it('should list all configurations (admin)', async () => {
    const res = await request(app)
      .get('/api/configurations')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Delete operations (admin/user)', () => {
  it('should delete configuration (user)', async () => {
    const res = await request(app)
      .delete(`/api/configurations/${configId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should delete component (admin)', async () => {
    const res = await request(app)
      .delete(`/api/components/${componentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should delete partner (admin)', async () => {
    const res = await request(app)
      .delete(`/api/partners/${partnerId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should delete category (admin)', async () => {
    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});
