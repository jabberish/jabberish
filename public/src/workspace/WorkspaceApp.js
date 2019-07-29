import Component from '../Component.js';
import { submitVerify } from '../services/auth-api.js';

const socket = io();

class WorkspaceApp extends Component {

  render() {
    const dom = this.renderDOM();

    submitVerify()
      .then(res => console.log(res));

    const form = dom.querySelector('.message-form');
    const input = dom.querySelector('#message');
    const messages = dom.querySelector('#messages');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      socket.emit('chat message', input.value);
      input.value = '';
      return false;
    });

    socket.on('chat message', (msg) => {
      const li = document.createElement('li');
      li.textContent = msg;
      messages.appendChild(li);
    });
    

    return dom;
  }

  renderTemplate() {
    return /*html*/`
      <div>
        <h1>Workspace is working</h1>
        <ul id="messages"></ul>
        <form class="message-form" action="">
          <input id="message" autocomplete="off" /><button>Send</button>
        </form>
      </div>
    `;
  }
}

export default WorkspaceApp;
