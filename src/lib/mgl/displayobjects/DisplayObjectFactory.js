import Sprite from './Sprite';
import Text from './Text';

export default class DisplayObjectFactory {
  constructor(scene) {
    this._scene = scene;
    this._items = scene.displayList;
  }

  sprite(x, y, texture, width, height) {
    let item = new Sprite(this._scene, x, y, texture, width, height);
    this._items.add(item);
    return item;
  }

  text(x, y, text, style) {
    let item = new Text(this._scene, x, y, text, style);
    this._items.add(item);
    return item;
  }
}