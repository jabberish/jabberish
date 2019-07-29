import htmlToDOM from './utils/html-to-DOM.js';

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  render() {
    return this.renderDOM();
  }

  renderDOM() {
    const html = this.renderTemplate();
    const dom = htmlToDOM(html);
    // remember the dom for later
    // for replacing or removing
    this.rootElement = dom;
    return dom;
  }

  renderTemplate() {
    throw new Error(`Component "${this.constructor.name}" needs to implement renderTemplate`);
  }

  update(props) {
    props = props || {};
    // update the props:
    Object.assign(this.props, props);

    const oldRoot = this.rootElement;

    if(!oldRoot) {
      throw new Error(`"update()" was called on Component "${this.constructor.name}", but no prior render has happened. Be sure to call ".render()" before using ".update()"`);
    }

    const newDOM = this.render();
    oldRoot.replaceWith(newDOM);
  }
}

export default Component;