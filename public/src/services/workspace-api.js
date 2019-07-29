const submitAddWorkspace = (name) => {
  return fetch('http://localhost:3000/api/v1/workspaces', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name
    })
  })
    .then(res => res.json());
};

export {
  submitAddWorkspace
};
