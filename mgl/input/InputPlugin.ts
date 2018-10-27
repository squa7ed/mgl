import { InteractiveObject } from './InteractiveObject';
import { EventEmitter } from '../EventEmitter';
import { Scene } from '../scene/Scene';
import { InputManager } from './InputManager';
import { DisplayObject } from '../displayobjects/DisplayObject';
import { Point, Pointer } from './Pointer';

export class InputPlugin extends EventEmitter {
  constructor(private _scene: Scene) {
    super();
    this._manager = _scene.game.input;
    this._items = [];
  }

  private _manager: InputManager;

  private _items: InteractiveObject[];

  dispose(): void {
    this._items.splice(0).forEach(item => item.disable());
    this._scene = undefined;
  }

  update(time: number, dt: number): void {
    let manager = this._manager;
    let pointer = manager.pointer;
    let list = this._getPointerOverItems(pointer);
    let len = list.length;
    if (len > 0) {
      this._sortInteractiveObjects(list);
      this._invokeEvents(list, pointer);
    }
  }

  enable(displayObject: DisplayObject): void {
    if (displayObject.input && displayObject.input.isEnabled) {
      return;
    }
    displayObject.setInteractive();
  }

  createInteractiveObject(target: DisplayObject): InteractiveObject {
    return new InteractiveObject(this, target);
  }

  disable(displayObject: DisplayObject) {
    if (!displayObject.input || !displayObject.input.isEnabled) {
      return;
    }
    displayObject.input.disable();
  }

  _getPointerOverItems(pointer: Pointer): InteractiveObject[] {
    return this._items.filter(item => item.isPointerOver(pointer));
  }

  _sortInteractiveObjects(list: InteractiveObject[]): InteractiveObject[] {
    return list.sort(this._compareInteractiveObjets);
  }

  _compareInteractiveObjets(itemA: InteractiveObject, itemB: InteractiveObject): number {
    let displayList = this._scene.displayList;
    let ia = displayList.getIndexOf(itemA.target);
    let ib = displayList.getIndexOf(itemB.target);
    // Items that are at the front of the DisplayList has a deeper Z-Index.
    return ib - ia;
  }

  _invokeEvents(list: InteractiveObject[], pointer: Pointer): void {
    list.forEach(item => {
      if (pointer.isDown) {
        item.target.emit('pointerDown', item.target, pointer);
        this.emit('displayObjectDown', item.target, pointer);
      }
      if (pointer.isMove) {
        item.target.emit('pointerMove', item.target, pointer);
        this.emit('displayObjectOver', item.target, pointer);
      }
      if (pointer.isUp) {
        item.target.emit('pointerUp', item.target, pointer);
        this.emit('displayObjectOut', item.target, pointer);
      }
    });
  }

  add(target: InteractiveObject): InteractiveObject {
    if (this._items.indexOf(target) !== -1) {
      return;
    }
    this._items.push(target);
    return target;
  }

  remove(target: InteractiveObject): boolean {
    let index = this._items.findIndex(item => item === target);
    if (index !== -1) {
      this._items.splice(index, 1);
      return true;
    }
    return false;
  }

  clear(): void {
    this._items.forEach(item => item.disable());
    this._items.length = 0;
  }
}
