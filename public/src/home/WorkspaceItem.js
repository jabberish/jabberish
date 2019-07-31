import Component from '../Component.js';

import { submitDeleteWorkspace } from '../services/workspace-api.js';

class WorkspaceItem extends Component {

  render() {
    const dom = this.renderDOM();

    const deleteWorkspace = dom.querySelector('.delete-workspace');

    const workspace = this.props.workspace;

    if(deleteWorkspace) {
      deleteWorkspace.addEventListener('click', () => {
        submitDeleteWorkspace(workspace._id)
          .then(res => {
            if(!res.ok) throw new Error('Error deleting workspace');
          }) 
          .catch(err => console.log(err));
      });
    }
    
    return dom;
  }

  renderTemplate() {
    const workspace = this.props.workspace;
    const user = this.props.user;
    return /*html*/`
    <li>
      <a href="./workspace.html#workspace=${workspace._id}">
        <h3>${workspace.name}</h3>
      </a>
      ${user._id === workspace.owner ? '<button class="delete-workspace">Delete</button>' : ''}
    </li>
      
    `;
  }
}

export default WorkspaceItem;
