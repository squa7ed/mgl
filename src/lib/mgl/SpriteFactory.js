import Sprite from './Sprite';

export default class SpriteFactory {
  constructor(game) {
    this._game = game;
    this._items = game.displayList;
  }

  sprite(x, y, texture, width, height) {
    let sprite = new Sprite(this._game, x, y, texture, width, height);
    this._items.add(sprite);
    return sprite;
  }
}