process.env.NODE_ENV = 'test';
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

  it('returns the top active users by the amount of messages they send', () => {
    return getAgent()
      .get('/api/v1/users/active')
      .then(res => {
        expect(res.body).toHaveLength(5);
        res.body.slice(0, 4).forEach((user, i) => {
          expect(res.body[i].count).toBeGreaterThanOrEqual(res.body[i + 1].count);
        });
      });
  });
});
