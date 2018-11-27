import { Tween, TweenState, TweenConfig } from './Tween';
import { Scene } from '../scene/Scene';

export default class TweenManager {
  constructor(private _scene: Scene) {
    this._tweens = [];
    this._pendingAdd = [];
    this._pendingRemove = [];
  }

  private _tweens: Tween[];

  private _pendingAdd: Tween[];

  private _pendingRemove: Tween[];

  add(config: TweenConfig) {
    let tween = new Tween(this, config);
    this._pendingAdd.push(tween);
    return this;
  }

  update(time: number, dt: number) {
    let list = this._tweens.splice(0);
    this._pendingRemove.push(...list.filter(tween => tween.state === TweenState.FINISHED));
    this._pendingRemove.forEach(tween => {
      let index = list.indexOf(tween);
      if (index !== -1) {
        list.splice(index, 1);
      }
    });
    this._pendingRemove.length = 0;
    list.push(...this._pendingAdd.splice(0));
    this._tweens = list;
    this._tweens.forEach(tween => {
      tween.update(time, dt);
    });
  }

  clear(): void {
    this._pendingAdd.length = 0;
    this._pendingRemove.length = 0;
    this._tweens.length = 0;
  }
}