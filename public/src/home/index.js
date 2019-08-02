import Home from './App.js';

const home = new Home();
const homeDOM = home.render();

const root = document.getElementById('app');
root.appendChild(homeDOM);
