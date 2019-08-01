const { getAgent, getUsers, getWorkspaces } = require('../data-helpers');
const UserByWorkspace = require('../../lib/models/UserByWorkspace');

describe('workspaces routes', () => {
  it('creates a workspace and returns a user to workspace relationship', () => {
    const user = getUsers()[0];
    return getAgent()
      .post('/api/v1/workspaces')
      .send({ name: 'test-workspace' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: user._id,
          workspace: expect.any(String)
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
          user: users[1]._id,
          workspace: workspace._id
        });
      });
  });

  it('returns all workspaces the user is a member of', async() => {
    const users = getUsers();
    const workspaces = getWorkspaces().slice(0, 3);

    await UserByWorkspace.create([{ 
      user: users[0]._id,
      workspace: workspaces[1]._id 
    }, { 
      user: users[0]._id,
      workspace: workspaces[2]._id
    }]);

    return getAgent()
      .get('/api/v1/workspaces/member')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        res.body.forEach(workspace => {
          expect(workspace).toEqual({
            _id: expect.any(String),
            user: users[0]._id,
            workspace: {
              _id: expect.any(String),
              name: expect.any(String),
              owner: expect.any(String)
            }
          });
        });
      });
  });

  it('deletes the workspace by the user who owns it', () => {
    const workspace = getWorkspaces()[0];
    return getAgent()
      .delete(`/api/v1/workspaces/${workspace._id}`)
      .then(res => {
        expect(res.body.ok).toEqual(1);
      });
  });
});
