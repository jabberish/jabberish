import Workspace from './WorkspaceApp.js';

const workspace = new Workspace();
const workspaceDOM = workspace.render();

const root = document.getElementById('app');
root.appendChild(workspaceDOM);
