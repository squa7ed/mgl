import Sprite from './Sprite';
import Text from './Text';

export default class DisplayObjectFactory {
  constructor(game) {
    this._game = game;
    this._items = game.displayList;
  }

  sprite(x, y, texture, width, height) {
    let item = new Sprite(this._game, x, y, texture, width, height);
    this._items.add(item);
    return item;
  }

  text(x, y, text, style) {
    let item = new Text(this._game, x, y, text, style);
    this._items.add(item);
    return item;
  }
}