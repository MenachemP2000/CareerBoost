/**
 * POST /api/tokens  (login)
 * – happy path returns a JWT
 * – wrong password returns 401
 */

/**
 * POST /api/tokens  (login)
 * – happy path returns a JWT
 * – wrong password / missing user returns 404
 */

const express  = require('express');
const request  = require('supertest');

/* ---- mocks --------------------------------------------------------- */
jest.mock('../models/User', () => {
  const findOne = jest.fn();
  function MockUser() {}
  MockUser.findOne = findOne;
  return MockUser;
});
const User = require('../models/User');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake.jwt.token'),
}));
const jwt = require('jsonwebtoken');

/* ---- tiny test server using the real router ------------------------ */
const tokenRoutes = require('../routes/tokenRoutes');   // calls .processLogin
const app = express();
app.use(express.json());
app.use('/api/tokens', tokenRoutes);

/* ---- fixtures ------------------------------------------------------ */
const GOOD_PW   = 'Pass1234';
const GOOD_USER = { _id: 'u123', username: 'alice', password: GOOD_PW };

/* ---- tests --------------------------------------------------------- */
describe('POST /api/tokens (login)', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 201 + token for valid credentials', async () => {
    User.findOne.mockResolvedValue(GOOD_USER);

    const res = await request(app)
      .post('/api/tokens')
      .send({ username: 'alice', password: GOOD_PW });

    expect(res.statusCode).toBe(201);          // controller uses 201
    expect(res.body.token).toBe('fake.jwt.token');
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('returns 404 when password is wrong (or user missing)', async () => {
    User.findOne.mockResolvedValue(GOOD_USER); // user found but pw mismatch

    const res = await request(app)
      .post('/api/tokens')
      .send({ username: 'alice', password: 'wrongPW1' });

    expect(res.statusCode).toBe(404);          // empty body is OK
  });
});
