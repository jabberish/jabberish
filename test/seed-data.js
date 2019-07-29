const User = require('../lib/models/User');
const chance = require('chance').Chance();

module.exports = async({ users = 5 } = {}) => {
  const createdUsers = await User.create([...Array(users)].map(() => ({
    username: chance.name(),
    password: 'password'
  })));

  return {
    users: createdUsers,
  };
};
