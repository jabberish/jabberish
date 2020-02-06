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
let seededWorkspaces = null;
let seededUsersByWorkspaces = null;
let seededChannels = null;
let seededMessages = null;
let token = null;
beforeEach(async () => {
  const { users, workspaces, usersByWorkspaces, channels, messages } = await seedData();
  seededUsers = prepare(users);
  seededWorkspaces = prepare(workspaces);
  seededUsersByWorkspaces = prepare(usersByWorkspaces);
  seededChannels = prepare(channels);
  seededMessages = prepare(messages);

  return await agent
    .post('/api/v1/auth/signin')
    .send({ username: seededUsers[0].username, password: 'password' })
    .then(res => (token = res.header['set-cookie'][0]));
});

afterAll(() => {
  return mongoose.connection.close();
});

module.exports = {
  getAgent: () => agent,
  getUsers: () => seededUsers,
  getWorkspaces: () => seededWorkspaces,
  getUsersByWorkspaces: () => seededUsersByWorkspaces,
  getChannels: () => seededChannels,
  getMessages: () => seededMessages,
  getToken: () => token
};
