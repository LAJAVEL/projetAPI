const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
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

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  await connectTestDb();
});

afterAll(async () => {
  if (mongoose.connection?.readyState === 1 && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  if (mongoose.connection?.readyState) {
    await mongoose.connection.close();
  }
});

describe('API Auth', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
