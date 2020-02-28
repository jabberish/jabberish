process.env.NODE_ENV = 'test';
const request = require('supertest');
const { http } = require('../../lib/app');

describe('Not Found Route', () => {
  it('does not find a route', () => {
    return request(http)
      .get('/api/v1/auth/fasdf')
      .then(res => {
        expect(res.body).toEqual({
          status: 404,
          message: 'Not Found'
        });
      });
  });
});
