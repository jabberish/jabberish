require('dotenv').config();
const seedData = require('./seed-data');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');

const prepare = arr => JSON.parse(JSON.stringify(arr));

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

let agent = request.agent(app);
let seededUsers = null;
beforeEach(async() => {
  const { users } = await seedData();
  seededUsers = prepare(users);

  // return await agent
  //   .post('/api/v1/auth/signin')
  //   .send({ username: seededUsers[0].username, password: 'password' });
});

afterAll(() => {
  return mongoose.connection.close();
});

module.exports = {
  getAgent: () => agent,
  getUsers: () => seededUsers,
};
