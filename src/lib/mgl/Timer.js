import EventEmitter from "./EventEmitter";
import { GetValue } from './Utils';

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

/**
 * @typedef {object} TimerEventConfig
 *
 * @property {number} [delay=0] - [description]
 * @property {function} [callback] - [description]
 * @property {*} [context] - [description]
 */

class TimerEvent {
  /**
   * 
   * @param {TimerEventConfig} config 
   */
  constructor(config) {
    this.config = config;
    this.delay = 0;
    this.callback = undefined;
    this.context = undefined;
    this.args = [];
    this.elapsed = 0;
    this.reset(config);
  }

  reset(config) {
    this.delay = GetValue(config, 'delay', 0);
    this.callback = GetValue(config, 'callback', undefined);
    this.context = GetValue(config, 'context', undefined);
    this.args = GetValue(config, 'args', []);
    this.elapsed = 0;
  }

  dispose() {
    this.callback = undefined;
    this.context = undefined;
  }

  get progress() { return this.elapsed / this.delay; }
}