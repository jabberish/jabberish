import Component from '../Component.js';

class ChannelItem extends Component {

  render() {
    const dom = this.renderDOM();
    const selectChannel = this.props.selectChannel;
    const channel = this.props.channel;
    
    dom.addEventListener('click', () => {
      selectChannel(channel);
    });
    
    return dom;
  }

  renderTemplate() {
    const channel = this.props.channel;
    return /*html*/`
      <li class="channel">${channel.name}</li>
    `;
  }
}

export default ChannelItem;
