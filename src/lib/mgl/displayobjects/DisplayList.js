export default class DisplayList {
  constructor(game) {
    this._game = game;
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