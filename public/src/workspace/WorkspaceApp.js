import Component from '../Component.js';
import ChannelItem from './ChannelItem.js';

import { submitVerify } from '../services/auth-api.js';
import { getWorkspaceChannels, submitAddChannel } from '../services/channel-api.js';
import { addWorkspaceMember } from '../services/workspace-api.js';
import hashStorage from '../utils/hash-storage.js';

// eslint-disable-next-line no-undef
const socket = io();

class WorkspaceApp extends Component {

  render() {
    const dom = this.renderDOM();

    const channelList = dom.querySelector('.channels');
    const workspace = hashStorage.get().workspace;
    let room = hashStorage.get().channel;
    let user = null;

    const messageForm = dom.querySelector('.message-form');
    const channelForm = dom.querySelector('.channel-form');
    const inviteForm = dom.querySelector('.invite-form');
    const messageInput = dom.querySelector('#message-input');
    const channelInput = dom.querySelector('#channel-input');
    const inviteInput = dom.querySelector('#invite-input');
    const messages = dom.querySelector('#messages');

    submitVerify()
      .then(verifiedUser => {
        user = verifiedUser;
        if(verifiedUser) return getWorkspaceChannels(workspace);
        throw new Error('Invalid user');
      })
      .then((channels) => {
        if(channels.length) {
          channels.forEach(channel => {
            const channelItem = new ChannelItem({ 
              channel,
              workspaceId: workspace,
              selectChannel: (channelId) => {
                const queryProps = {
                  channel: channelId
                };
                hashStorage.set(queryProps);
                socket.emit('leave', room);
                socket.emit('join', channel._id);
                messages.innerHTML = '';  
                room = channelId;
              },
            });
            channelList.appendChild(channelItem.render());
          });
        }
      });

    channelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const workspace = hashStorage.get().workspace;
      submitAddChannel(channelInput.value, workspace)
        .then(res => console.log(res));
      channelInput.value = '';
    });

    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const workspace = hashStorage.get().workspace;
      socket.emit('chat message', { room, message: messageInput.value, user, workspace });
      messageInput.value = '';
      return false;
    });

    inviteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addWorkspaceMember(workspace, inviteInput.value)
        .then(res => console.log(res));
      inviteInput.value = '';
    });

    socket.on('chat message', (msg) => {
      const li = document.createElement('li');
      li.textContent = `${msg.user.username}: ${msg.text}`;
      messages.appendChild(li);
    });

    socket.on('history', (msgs) => {
      console.log(msgs);
      msgs = JSON.parse(JSON.stringify(msgs));
      msgs.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.user.username}: ${msg.text}`;
        messages.appendChild(li);
      });
    });
  
    return dom;
  }

  renderTemplate() {
    return /*html*/`
      <div>
        <h1>Workspace</h1>
        <section class="container">
          <section class="channels-container">
            <h2>Channels</h2>
            <section>
              <form class="channel-form" action="">
                <input id="channel-input" autocomplete="off" /><button>Create</button>
              </form>
            </section>
            <ul class="channels"></ul>
            <section>
              <form class="invite-form" action="">
                <input id="invite-input" autocomplete="off" default="username" /><button>Invite</button>
              </form>
            </section>
          </section>

          <section class="chat">
            <ul id="messages"></ul>
            <form class="message-form" action="">
              <input id="message-input" autocomplete="off" /><button>Send</button>
            </form>
          </section>
        </section>
      </div>
    `;
  }
}

export default WorkspaceApp;
