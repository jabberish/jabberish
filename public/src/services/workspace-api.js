const submitAddWorkspace = (name) => {
  return fetch('https://jabberish-app.herokuapp.com/api/v1/workspaces', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name
    })
  })
    .then(res => res.json());
};

const getMemberWorkspaces = () => {
  return fetch('https://jabberish-app.herokuapp.com/api/v1/workspaces/member', {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json());
};

const addWorkspaceMember = (workspace, username) => {
  return fetch(`https://jabberish-app.herokuapp.com/api/v1/workspaces/add-user/${workspace}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username
    })
  })
    .then(res => res.json());
};

const submitDeleteWorkspace = (workspace) => {
  return fetch(`http://localhost:3000/api/v1/workspaces/${workspace}`, {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json());
};

const submitLeaveWorkspace = (workspace) => {
  return fetch(`http://localhost:3000/api/v1/users/workspace/${workspace}`, {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json());
};

export {
  submitAddWorkspace,
  getMemberWorkspaces,
  addWorkspaceMember,
  submitDeleteWorkspace,
  submitLeaveWorkspace
};
