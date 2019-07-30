const getWorkspaceChannels = (workspace) => {
  return fetch(`http://localhost:3000/api/v1/channels/${workspace}`, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json());
};

const submitAddChannel = (name, workspace) => {
  return fetch('http://localhost:3000/api/v1/channels/', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      workspace
    })
  })
    .then(res => res.json());
};

export {
  getWorkspaceChannels,
  submitAddChannel
};