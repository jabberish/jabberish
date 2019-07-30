const submitLogin = (user) => {
  return fetch('https://jabberish-app.herokuapp.com/api/v1/auth/signin', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: user.username,
      password: user.password
    })
  })
    .then(res => res.json());
};

const submitRegister = (user) => {
  return fetch('https://jabberish-app.herokuapp.com/api/v1/auth/signup', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: user.username,
      password: user.password
    })
  })
    .then(res => res.json());
};

const submitVerify = () => {
  return fetch('https://jabberish-app.herokuapp.com/api/v1/auth/verify', {
    mode: 'cors',
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json());
};

export {
  submitLogin,
  submitRegister,
  submitVerify
};
