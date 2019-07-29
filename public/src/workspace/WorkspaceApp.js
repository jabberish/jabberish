import Component from '../Component.js';
import { submitVerify } from '../services/auth-api.js';

class WorkspaceApp extends Component {

  render() {
    const dom = this.renderDOM();

    submitVerify()
      .then(res => console.log(res));

    return dom;
  }

  renderTemplate() {
    return /*html*/`
      <div>
          <h1>Workspace is working</h1>
      </div>
    `;
  }
}

export default WorkspaceApp;
