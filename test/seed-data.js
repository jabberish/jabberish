const User = require('../lib/models/User');
const Workspace = require('../lib/models/Workspace');
const chance = require('chance').Chance();

module.exports = async({ users = 3, maxWorkspaces = 2 } = {}) => {
  const createdUsers = await User.create([...Array(users)].map(() => ({
    username: chance.name(),
    password: 'password'
  })));

  const createdWorkspaces = await Workspace.create(createdUsers.flatMap(user => {
    return [...Array(chance.integer({ min: 1, max: maxWorkspaces }))]
      .map(() => ({
        name: chance.animal(),
        owner: user._id
      }));
  }));
  
  return {
    users: createdUsers,
    workspaces: createdWorkspaces
  };
};
