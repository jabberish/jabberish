import Component from '../Component.js';

class WorkspaceItem extends Component {

  renderTemplate() {
    const workspace = this.props.workspace;
    return /*html*/`
      <a href="./workspace.html#workspace=${workspace._id}"<li>${workspace.name}</li></a>
    `;
  }
}

export default WorkspaceItem;
