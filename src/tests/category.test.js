const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
require('dotenv').config();

let adminToken;

beforeAll(async () => {
  // Ensure we are connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://127.0.0.1:27017/configurateur_pc_test');
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
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
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
  });

  it('should get all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
