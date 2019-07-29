import Component from '../Component.js';

class WorkspaceItem extends Component {

  renderTemplate() {
    const workspace = this.props.workspace;
    return /*html*/`
      <a href="./Workspace.html#workspace=${workspace._id}"<li>${workspace.name}</li></a>
    `;
  }
}

export default WorkspaceItem;
