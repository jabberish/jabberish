const User = require('../lib/models/User');
const Workspace = require('../lib/models/Workspace');
const Channel = require('../lib/models/Channel');
const UserByWorkspace = require('../lib/models/UserByWorkspace');
const chance = require('chance').Chance();

module.exports = async({ users = 10, maxWorkspaces = 3 } = {}) => {
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

  // Create the member relationship between the owner and the workspace
  const createdUsersByWorkspaces = await UserByWorkspace
    .create(createdWorkspaces.map(workspace => {
      return { user: workspace.owner, workspace: workspace._id };
    }));

  const createdChannels = await Channel
    .create(createdWorkspaces.map(workspace => {
      return { name: 'General', workspace: workspace._id };
    }));

  return {
    users: createdUsers,
    workspaces: createdWorkspaces,
    usersByWorkspaces: createdUsersByWorkspaces,
    channels: createdChannels
  };
};
