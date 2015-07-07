import Eventable from 'eventable';
import ZComponent from 'z-component';
import { mixin } from 'lib/utils';
import Composable from 'mixins/composable';

class NavigationItem extends ZComponent {
  constructor(item) {
    super(...arguments);

    this.item = item;
  }

  get active() {
    return this._active;
  }

  set active(val) {
    this._active = val;
    this.el.classList[val ? 'add' : 'remove']('nav__item--active');
    this.section.active = val;
  }

  get item() {
    return this._item;
  }

  set item(val) {
    this._item = val;
    this.el.textContent = val.heading;
    this.el.setAttribute('data-id', val.id);
    this.section = val.section;
    this.active = val.active;
  }

  static get tagName() {
    return 'span';
  }

  static get classList() {
    return ['nav__item'];
  }
}

class Navigation extends ZComponent {
  constructor(options = {}) {
    super(options);

    this.items = options.items;

    if (options.active) {
      this.active = options.active;
    }
  }

  get events() {
    return {
      'click': 'onClick'
    };
  }

  get active() {
    return this._active;
  }

  set active(val) {
    const prev = this._active;
    const next = this.lookup(val);

    if (prev === next) { return; }

    if (prev) {
      prev.active = false;
    }

    next.active = true;
    this._active = next;
  }

  remove() {
    this.clear();
    return super.remove();
  }

  onClick(e) {
    const target = e.target;
    const classList = target.classList;

    if (!classList.contains('nav__item') ||
        classList.contains('nav__item--disabled')) {
      return;
    }

    const id = target.getAttribute('data-id');

    this.active = id;
  }

  static get classList() {
    return ['nav'];
  }
}

Navigation.Item = NavigationItem;

mixin(Navigation.prototype, Composable, Eventable, {
  get cache() {
    return this._cache || {};
  },

  set cache(val) {
    this._cache = val;
  },

  lookup(id) {
    return this.cache[id];
  },

  addChildView(item) {
    const view = Composable.addChildView.call(this, item);

    this.cache[item.id || item.value] = view;

    return view;
  },

  removeChildView(view) {
    Composable.removeChildView.call(this, view);

    delete this.cache[view.data.id];
  },

  clear() {
    Composable.clear.call(this);

    this.cache = {};
  }
});

export default Navigation;
