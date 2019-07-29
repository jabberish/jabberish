import Component from '../Component.js';
import { submitVerify } from '../services/auth-api.js';
import { submitAddWorkspace } from '../services/workspace-api.js';

class App extends Component {

  render() {
    const dom = this.renderDOM();

    const form = dom.querySelector('#workspace-form');

    submitVerify()
      .then(res => console.log(res));

    form.addEventListener('submit', event => {
      event.preventDefault();
  
      const formData = new FormData(form);
  
      const workspace = {
        name: formData.get('name')
      };

      submitAddWorkspace(workspace.name)
        .then(res => console.log(res));
    });

    return dom;
  }

  renderTemplate() {
    return /*html*/`
      <div>
        <h1>Jabberish is working</h1>
        <a href="./login.html">login</a>
        <a href="./register.html">register</a>
        <h2>Workspaces</h2>
        <ul class="workspaces"></ul>
        <h2>Add New Workspace</h2>
        <form id="workspace-form">
          <label>workspace name:
            <input id="name" name="name" required>
          </label>
          <button>Submit</button>
        </form>
      </div>
    `;
  }
}

export default App;
