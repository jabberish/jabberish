const User = require('../lib/models/User');
const Workspace = require('../lib/models/Workspace');
const Channel = require('../lib/models/Channel');
const Message = require('../lib/models/Message');
const UserByWorkspace = require('../lib/models/UserByWorkspace');
const chance = require('chance').Chance();

module.exports = async ({ users = 5, maxWorkspaces = 3, maxChannels = 3, maxMessages = 10 } = {}) => {
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      username: chance.name(),
      password: 'password'
    }))
  );

  const createdWorkspaces = await Workspace.create(
    createdUsers.flatMap(user => {
      return [...Array(chance.integer({ min: 2, max: maxWorkspaces }))].map(() => ({
        name: chance.animal(),
        owner: user._id
      }));
    })
  );

  // Create the member relationship between the owner and the workspace
  const createdUsersByWorkspaces = await UserByWorkspace.create(
    createdWorkspaces.map(workspace => {
      return { user: workspace.owner, workspace: workspace._id };
    })
  );

  const createdChannels = await Channel.create(
    createdWorkspaces.flatMap(workspace => {
      return [...Array(chance.integer({ min: 1, max: maxChannels }))].map(() => ({
        name: chance.animal(),
        workspace: workspace._id
      }));
    })
  );

  const createdMessages = await Message.create(
    createdChannels.flatMap(channel => {
      return [...Array(chance.integer({ min: 1, max: maxMessages }))].map(() => ({
        user: chance.pickone(createdUsers)._id,
        channel: channel._id,
        workspace: channel.workspace,
        text: chance.sentence()
      }));
    })
  );

  return {
    users: createdUsers,
    workspaces: createdWorkspaces,
    usersByWorkspaces: createdUsersByWorkspaces,
    channels: createdChannels,
    messages: createdMessages
  };
};
