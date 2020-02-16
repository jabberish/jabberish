const { getAgent } = require('../data-helpers');
const request = require('supertest');
const { http } = require('../../lib/app');

describe('Error tests', () => {
	it('fails due to mongo cast', () => {
    return getAgent()
      .get(`/api/v1/channels/qrwer`)
      .then(res => {
        expect(res.body).toEqual({
          status: 400,
          message: 'Cast to ObjectId failed for value \"qrwer\" at path \"workspace\" for model \"UserByWorkspace\"'
        });
      });
	});
	
	
	it('404s to force an error print for test coverage', () => {
		process.env.NODE_ENV = 'test-error';
    return request(http)
      .get(`/api/v1/404`)
      .then(res => {
        expect(res.body).toEqual({
          status: 404,
          message: 'Not Found'
				});
				process.env.NODE_ENV = 'test';
			});
	});
})