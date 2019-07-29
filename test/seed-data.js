const User = require('../lib/models/User');
const Workspace = require('../lib/models/Workspace');
const UserByWorkspace = require('../lib/models/UserByWorkspace');
const chance = require('chance').Chance();

module.exports = async({ users = 3 } = {}) => {
  const createdUsers = await User.create([...Array(users)].map(() => ({
    username: chance.name(),
    password: 'password'
  })));

  const createdWorkspaces = await Workspace.create(createdUsers.flatMap(user => {
    return {
      name: chance.animal(),
      owner: user._id
    };
  }));

  const createdUsersByWorkspaces = await UserByWorkspace
    .create(createdWorkspaces.map(workspace => {
      return { user: workspace.owner, workspace: workspace._id };
    }));

  return {
    users: createdUsers,
    workspaces: createdWorkspaces,
    UsersByWorkspaces: createdUsersByWorkspaces
  };
};
