import Component from '../Component.js';
import { submitRegister } from '../services/auth-api.js';

class loginApp extends Component {

  render() {
    const dom = this.renderDOM();

    const form = dom.querySelector('form');

    form.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(form);

      const user = {
        username: formData.get('username'),
        password: formData.get('password'),
      };

      submitRegister(user)
        .then(res => {
          if(res._id) {
            window.location = './index.html';
          }
        });
    });

    return dom;
  }

  renderTemplate() {
    return /*html*/`
      <div>
          <h1>Register</h2>
          <form id="register-form">
            <label>username:
              <input id="username" name="username" required>
            </label>
            <label>Password:
              <input id="password" name="password" type="password" required></input>
            </label>
            <button>Submit</button>
          </form>
      </div>
    `;
  }
}

export default loginApp;
