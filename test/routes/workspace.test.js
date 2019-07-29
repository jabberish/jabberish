const { getAgent, getUsers, getWorkspaces } = require('../data-helpers');

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
});
