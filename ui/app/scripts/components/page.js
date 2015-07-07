import ZComponent from 'z-component';

class Page extends ZComponent {
  constructor({ context }) {
    super(...arguments);

    this.context = context;
  }

  get title() {
    return this._title || '';
  }

  set title(val) {
    this._title = val;
    this.$('.page__heading').textContent = this._title;
  }

  get description() {
    return this._description || '';
  }

  set description(val) {
    this._description = val;
    this.$('.page__description').textContent = this._description;
  }

  static get classList() {
    return ['page'];
  }

  static get template() {
    var template = ZComponent.template;

    template.fragment.firstChild.innerHTML =
    `<header class="page__header">
      <h1 class="page__heading"></h1>
    </header>
    <p class="page__description"></p>`.replace(/>\s+/g, '>');

    return template;
  }
}

export default Page;
