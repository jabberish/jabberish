const getWorkspaceChannels = (workspace) => {
  return fetch(`http://localhost:3000/api/v1/channels/${workspace}`, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json());
};

export {
  getWorkspaceChannels
};
