import EventEmitter from '../EventEmitter';
import TimerEvent from './TimerEvent';

export default class Timer extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this._pendingAdd = [];
    this._pendingRemove = [];
    this._callbacks = [];
  }

  delayedCallback(callback, delay, context) {
    let event = new TimerEvent({ delay: delay, callback: callback, context: context });
    this._pendingAdd.push(event);
    return event;
  }

  update(time, dt, frame) {
    this._pendingAdd
      .splice(0)
      .forEach(event => this._callbacks.push(event));
    this._pendingRemove
      .splice(0)
      .forEach(event => {
        let index = this._callbacks.indexOf(event);
        if (index !== -1) {
          this._callbacks.splice(index, 1);
          event.dispose();
        }
      });
    this._callbacks.forEach(event => {
      event.elapsed += dt;
      if (event.progress >= 1) {
        event.callback.apply(event.context, event.args);
        this._pendingRemove.push(event);
      }
    })
  }
}
