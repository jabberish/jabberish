const { getWorkspaces, getAgent, getUsers } = require('../data-helpers');

describe('auth routes', () => {
  it('removes the relationship between user and workspace', () => {
    const workspace = getWorkspaces()[0];
    const user = getUsers()[0];
    return getAgent()
      .delete(`/api/v1/users/workspace/${workspace._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: user._id,
          workspace: workspace._id
        });
      });
  });
});
