import Component from '../Component.js';
import { submitVerify } from '../services/auth-api.js';

class App extends Component {

  render() {
    const dom = this.renderDOM();

    submitVerify()
      .then(res => console.log(res));

    return dom;
  }

  renderTemplate() {
    return /*html*/`
      <div>
          <h1>Jabberish is working</h1>
          <a href="./login.html">login</a>
          <a href="./register.html">register</a>
      </div>
    `;
  }
}

export default App;
