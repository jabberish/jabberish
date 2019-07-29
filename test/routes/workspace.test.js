const { getAgent, getUsers, getWorkspaces } = require('../data-helpers');

describe('workspace routes', () => {
  it('creates and returns a workspace', () => {
    const user = getUsers()[0];
    return getAgent()
      .post('/api/v1/workspaces')
      .send({ name: 'test-workspace' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'test-workspace',
          owner: user._id
        });
      });
  });

  it('returns all workspaces', () => {
    const workspaces = getWorkspaces();
    return getAgent()
      .get('/api/v1/workspaces')
      .then(res => {
        expect(res.body).toHaveLength(workspaces.length);
        workspaces.forEach(workspace => {
          delete workspace.__v;
          expect(res.body).toContainEqual(workspace);
        });
      });
  });
});
