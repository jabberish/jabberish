import Component from '../Component.js';

class WorkspaceItem extends Component {

  renderTemplate() {
    const workspace = this.props.workspace;
    return /*html*/`
      <li>${workspace.name}</li>
    `;
  }
}

export default WorkspaceItem;
