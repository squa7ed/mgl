import { Sprite } from './Sprite';
import { Text, TextStyleType } from './Text';
import { DisplayList } from './DisplayList';
import { Scene } from '../scene/Scene';

export class DisplayObjectFactory {
  constructor(private _scene: Scene) {
    this._scene = _scene;
    this._items = _scene.displayList;
  }

  private _items: DisplayList;

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