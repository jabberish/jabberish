import Landing from './LandingApp.js';

const landing = new Landing();
const landingDOM = landing.render();

const root = document.getElementById('app');
root.appendChild(landingDOM);
