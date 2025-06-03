/**
 * Unit-test for POST /api/users  (register)
 *   – happy path → 201
 *   – short password → 400
 *   – missing fields → 400
 *
 * Uses supertest + a tiny Express app that mounts your router.
 * The User model is fully mocked: no MongoDB needed.
 */

const express  = require('express');
const request  = require('supertest');
const userRoutes = require('../routes/userRoutes');

// ----- mock User model -----
jest.mock('../models/User', () => {
  // minimal fake constructor with static findOne and instance save
  const mockFindOne = jest.fn();
  const mockSave    = jest.fn().mockResolvedValue(undefined);

  function MockUser(doc) { Object.assign(this, doc); }
  MockUser.findOne = mockFindOne;
  MockUser.prototype.save = mockSave;

  return MockUser;
});
const User = require('../models/User');

// ----- tiny test server -----
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// ----- tests -----
describe('POST /api/users (register)', () => {
  afterEach(() => jest.clearAllMocks());

  const goodBody = {
    username:  'alice',
    password:  'Pass1234',
    country:   'Israel',
    experience:'0',
    age:       '25',
    education: "Bachelor's"
  };

  it('returns 201 and saves when body is valid', async () => {
    User.findOne.mockResolvedValue(null);     // username not taken

    const res = await request(app)
      .post('/api/users')
      .send(goodBody);

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('alice');
    expect(User.findOne).toHaveBeenCalledWith({ username: 'alice' });
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it('rejects password < 8 chars', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ ...goodBody, password: 'short1' });   // 6 chars

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/8 characters/);
  });

  it('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ username: 'bob' });   // everything else missing

    expect(res.statusCode).toBe(400);
  });
});
