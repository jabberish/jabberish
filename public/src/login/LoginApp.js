import Component from '../Component.js';
import { submitLogin } from '../services/auth-api.js';

class loginApp extends Component {

  render() {
    const dom = this.renderDOM();

    const form = dom.querySelector('form');

    form.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(form);

      const user = {
        username: formData.get('username'),
        password: formData.get('password')
      };

      submitLogin(user)
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
        <h1>Login is working</h2>
        <form id="login-form">
          <label>username:
            <input id="username" name="username" required>
          </label>
          <label>Password:
            <input id="password" name="password" type="password" required></input>
          </label>
          <p class="login-error">${this.props.loginSuccess ? '' : 'username and password couldn`t be verified.'}</p>
          <button>Submit</button>
        </form>
      </div>
    `;
  }
}

export default loginApp;
