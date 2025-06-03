/**
 * currency.api.test.js
 * Unit-tests the two helpers that read JSON files:
 *   – GET /api/rates          → getExchangeRates
 *   – GET /api/currency-flags → getCurrenciesFlags
 *
 * Covers:
 *  1) happy-path (file exists, JSON read)
 *  2) file missing   → 500
 *  3) read error     → 500
 */

const express = require('express');
const request = require('supertest');

/* ── mock fs completely ───────────────────────────────────────────── */
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFile:   jest.fn(),
}));
const fs = require('fs');

/* ── import the (now CommonJS) controller ─────────────────────────── */
const {
  getExchangeRates,
  getCurrenciesFlags,
} = require('../controllers/exchangeController');   // adjust path if needed

/* ── tiny Express app just for these two routes ───────────────────── */
const app = express();
app.get('/api/rates',          getExchangeRates);
app.get('/api/currency-flags', getCurrenciesFlags);

/* ── fixture JSON text ─────────────────────────────────────────────── */
const fakeJson = JSON.stringify({ USD: 1, ILS: 3.7 });

describe('Currency helpers', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /api/rates — returns JSON when file exists', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFile.mockImplementation((_, __, cb) => cb(null, fakeJson));

    const res = await request(app).get('/api/rates');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ USD: 1, ILS: 3.7 });
  });

  test('GET /api/rates — 500 when file missing', async () => {
    fs.existsSync.mockReturnValue(false);

    const res = await request(app).get('/api/rates');

    expect(res.statusCode).toBe(500);
  });

  test('GET /api/currency-flags — 500 on read error', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFile.mockImplementation((_, __, cb) => cb(new Error('boom')));

    const res = await request(app).get('/api/currency-flags');

    expect(res.statusCode).toBe(500);
  });
});
