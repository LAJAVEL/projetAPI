const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/configurateur_pc_test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('API Auth', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });
    if (res.statusCode !== 201) console.log(res.body);
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
