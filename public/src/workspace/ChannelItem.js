import Component from '../Component.js';

import { submitDeleteChannel } from  '../services/channel-api.js';

class ChannelItem extends Component {

  render() {
    const dom = this.renderDOM();

    const selectChannelBtn = dom.querySelector('.select-channel');
    const deleteChannelBtn = dom.querySelector('.delete-channel');
    
    const selectChannel = this.props.selectChannel;
    const channel = this.props.channel;
    const workspaceId = this.props.workspaceId;
    
    selectChannelBtn.addEventListener('click', () => {
      selectChannel(channel._id);
    });

    deleteChannelBtn.addEventListener('click', () => {
      submitDeleteChannel(channel._id, workspaceId);
    });
    
    return dom;
  }

  renderTemplate() {
    const channel = this.props.channel;
    return /*html*/`
      <li class="channel">
        <section class="select-channel">${channel.name}</section>
        <button class="delete-channel">Delete</button>
      </li>
    `;
  }
}

export default ChannelItem;
