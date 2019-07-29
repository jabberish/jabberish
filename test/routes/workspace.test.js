const { getAgent, getUsers, getWorkspaces } = require('../data-helpers');
const UserByWorkspace = require('../../lib/models/UserByWorkspace');

describe('workspace routes', () => {
  it('creates a workspace and returns a user to workspace relationship', () => {
    const user = getUsers()[0];
    return getAgent()
      .post('/api/v1/workspaces')
      .send({ name: 'test-workspace' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: user._id,
          workspaceId: expect.any(String)
        });
      });
  });

  it('returns all workspaces the user is an owner of', () => {
    const user = getUsers()[0];
    let workspaces = getWorkspaces();
    workspaces = workspaces.filter(workspace => workspace.owner === user._id);
    return getAgent()
      .get('/api/v1/workspaces/owner')
      .then(res => {
        expect(res.body).toHaveLength(workspaces.length);
        workspaces.forEach(workspace => {
          delete workspace.__v;
          expect(res.body).toContainEqual(workspace);
        });
      });
  });

  it('adds a user to a workspace and returns a user to workspace relationship', () => {
    const users = getUsers();
    const workspace = getWorkspaces()[0];

    return getAgent()
      .post(`/api/v1/workspaces/add-user/${workspace._id}`)
      .send({ username: users[1].username })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: users[1]._id,
          workspaceId: workspace._id
        });
      });
  });

  it('returns all workspaces the user is a member of', async() => {
    const users = getUsers();
    const workspaces = getWorkspaces();

    await UserByWorkspace.create([{ 
      userId: users[0]._id,
      workspaceId: workspaces[1]._id 
    }, { 
      userId: users[0]._id,
      workspaceId: workspaces[2]._id
    }]);

    return getAgent()
      .get('/api/v1/workspaces/member')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
      });
  });
});
