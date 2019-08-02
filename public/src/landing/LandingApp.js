import Component from '../Component.js';

class LandingApp extends Component {
  renderTemplate() {
    return /*html*/`
      <div>
          <h1>Landing</h1>
          <a href="./login.html">login</a>
          <a href="./register.html">register</a>
      </div>
    `;
  }
}

export default LandingApp;
