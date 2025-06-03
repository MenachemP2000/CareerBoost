/**
 * PATCH /api/users/:id  (edit profile)
 * – success when token matches username
 * – 403 when token / username mismatch
 */

const express  = require('express');
const request  = require('supertest');

/* ---- mock User model ---------------------------------------------- */
jest.mock('../models/User', () => {
  const findById           = jest.fn();
  const findByIdAndUpdate  = jest.fn();
  function MockUser() {}
  MockUser.findById          = findById;
  MockUser.findByIdAndUpdate = findByIdAndUpdate;
  return MockUser;
});
const User = require('../models/User');

/* ---- mock JWT verify ---------------------------------------------- */
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),        // will be set per test
}));
const jwt = require('jsonwebtoken');

/* ---- stub the token middleware ------------------------------------ */
jest.mock('../controllers/tokenController', () => ({
  // simply call next(); controller itself re-verifies token
  isLoggedIn: (req, _res, next) => next(),
}));

/* ---- tiny express app with real user router ----------------------- */
const userRoutes = require('../routes/userRoutes');
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

/* ---- shared fixtures --------------------------------------------- */
const userId = 'u123';
const GOOD_USER = {
  _id:       userId,
  username:  'alice',
  password:  'Pass1234',
  country:   'Israel',
  experience:'0',
  age:       '25',
  education: "Bachelor's",
};

describe('PATCH /api/users/:id (edit profile)', () => {
  afterEach(() => jest.clearAllMocks());

  it('updates the profile when token matches username', async () => {
    // DB finds the user before update
    User.findById.mockResolvedValue(GOOD_USER);
    // DB returns updated doc
    User.findByIdAndUpdate.mockResolvedValue({ ...GOOD_USER, experience: '3' });

    // token decodes to the same username
    jwt.verify.mockReturnValue({ username: 'alice' });

    const res = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', 'Bearer faketoken')
      .send({ experience: '3' });

    expect(res.statusCode).toBe(200);
    expect(res.body.experience).toBe('3');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      { experience: '3' },
      expect.any(Object)           // { new:true, runValidators:true }
    );
  });

  it('returns 403 when token username differs', async () => {
    User.findById.mockResolvedValue(GOOD_USER);
    jwt.verify.mockReturnValue({ username: 'bob' });   // wrong user

    const res = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', 'Bearer faketoken')
      .send({ experience: '3' });

    expect(res.statusCode).toBe(403);
  });
});
