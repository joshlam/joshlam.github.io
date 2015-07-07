export default {
  get views() {
    return this._views || [];
  },

  set views(val) {
    this._views = val;
  },

  get items() {
    return this._items || [];
  },

  set items(val = []) {
    this.clear();
    this._items = val;
    val.forEach(item => this.addChildView(item));
  },

  addChildView(item) {
    const view = new this.constructor.Item(item);

    view.appendTo(this.el);
    this.views.push(view);

    return view;
  },

  removeChildView(view) {
    this.views = this.views.reduce((active, v) => {
      if (view !== v) {
        active.push(v);
      }

      return active;
    }, []);

    view.remove();
  },

  clear() {
    this.views.forEach(view => view.remove());

    this.views = [];
    this._items = [];
  }
};
