import Component from '../Component.js';
import ChannelItem from './ChannelItem.js';

import { submitVerify } from '../services/auth-api.js';
import { getWorkspaceChannels } from '../services/channel-api.js';
import hashStorage from '../utils/hash-storage.js';

// eslint-disable-next-line no-undef
const socket = io();

class WorkspaceApp extends Component {

  render() {
    const dom = this.renderDOM();

    const channelList = dom.querySelector('.channels');

    const workspace = hashStorage.get().workspace;

    submitVerify()
      .then(res => console.log(res));

    getWorkspaceChannels(workspace)
      .then(channels => {
        channels.forEach(channel => {
          const channelItem = new ChannelItem({ 
            channel,
            selectChannel: (channel) => {
              const queryProps = {
                channel: channel._id
              };
              hashStorage.set(queryProps);  
            } });
          channelList.appendChild(channelItem.render());
        });
      });

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
        <section class="container">
          <section class="channels-container">
            <h2>Channels</h2>
            <ul class="channels"></ul>
          </section>
          <section class="chat">
            <ul id="messages"></ul>
            <form class="message-form" action="">
              <input id="message" autocomplete="off" /><button>Send</button>
            </form>
          </section>
        </section>
      </div>
    `;
  }
}

export default WorkspaceApp;
