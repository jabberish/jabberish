import Login from './LoginApp.js';

const login = new Login();
const loginDOM = login.render();

const root = document.getElementById('app');
root.appendChild(loginDOM);