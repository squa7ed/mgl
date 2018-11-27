import { GetValue, IDisposable } from '../Utils';
import { Scene } from "../scene/Scene";

export class Timer implements IDisposable {
  constructor(private _scene: Scene) {
    this._pendingAdd = [];
    this._pendingRemove = [];
    this._timerEvents = [];
  }

  private _pendingAdd: Array<TimerEvent>;

  private _pendingRemove: Array<TimerEvent>;

  private _timerEvents: Array<TimerEvent>;

  get scene() { return this._scene; }

  delayedCallback(callback: Function, delay: number, context: any): void {
    let event = new TimerEvent(this, { delay: delay, callback: callback, context: context });
    this._pendingAdd.push(event);
  }

  update(time: number, dt: number): void {
    this._pendingAdd
      .splice(0)
      .forEach(event => this._timerEvents.push(event));
    this._pendingRemove
      .splice(0)
      .forEach(event => {
        let index = this._timerEvents.indexOf(event);
        if (index !== -1) {
          this._timerEvents.splice(index, 1);
          event.dispose();
        }
      });
    this._timerEvents.forEach(event => {
      event.elapsed += dt;
      if (event.progress >= 1) {
        event.invoke();
        this._pendingRemove.push(event);
      }
    })
  }

  clear(): void {
    this._pendingAdd.length = 0;
    this._pendingRemove.length = 0;
    this._timerEvents.length = 0;
  }

  dispose(): void {
    this._pendingAdd.forEach(item => item.dispose());
    this._pendingRemove.forEach(item => item.dispose());
    this._timerEvents.forEach(item => item.dispose());
    this.clear();
    this._scene = undefined;
  }
}

type TimerEventConfig = {
  delay: number;
  callback: Function;
  context: any;
}

class TimerEvent {
  constructor(private _timer: Timer, config: TimerEventConfig) {
    this._delay = GetValue(config, 'delay', 0);
    this._callback = GetValue(config, 'callback', () => { });
    this._context = GetValue(config, 'context', _timer.scene);
  }

  private _delay: number;

  private _callback: Function;

  private _context: any;

  private _elapsed: number = 0;

  get delay() { return this._delay; }

  get callback() { return this._callback; }

  get context() { return this._context; }

  get elapsed() { return this._elapsed; }

  set elapsed(value) { this._elapsed = value; }

  get progress() { return this.elapsed / this.delay; }

  invoke(...params: any[]): void {
    this.callback.apply(this.context, params);
  }

  dispose(): void {
    if (this._timer === undefined) {
      return;
    }
    this._timer = undefined;
    this._callback = undefined;
    this._context = undefined;
  }
}


