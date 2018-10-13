export default class DisplayList {
  constructor(scene) {
    this._scene = scene;
    this._items = [];
  }

  add(item) {
    if (this._items.indexOf(item) === -1) {
      this._items.push(item);
    }
  }

  render(context) {
    this._items.forEach(sprite => sprite.render(context));
  }
}