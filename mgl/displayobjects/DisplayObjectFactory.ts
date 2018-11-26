import { Sprite } from './Sprite';
import { Text } from './text/Text';
import { TextStyleType } from './text/TextStyle';
import { DisplayList } from './DisplayList';
import { Scene } from '../scene/Scene';

export class DisplayObjectFactory {
  constructor(private _scene: Scene) {
    _scene.events.once('boot', this.boot, this);
  }

  private _items: DisplayList;

  boot() {
    this._items = this._scene.displayList;
  }

  sprite(x: number, y: number, texture: string, width?: number, height?: number): Sprite {
    let item = new Sprite(this._scene, x, y, texture);
    this._items.add(item);
    return item;
  }

  text(x: number, y: number, text: string, style: TextStyleType): Text {
    let item = new Text(this._scene, x, y, text, style);
    this._items.add(item);
    return item;
  }
}