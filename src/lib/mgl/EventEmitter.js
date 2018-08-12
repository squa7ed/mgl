export default class EventEmitter {
  constructor() {
    this._events = new Map();
    this.on = (event, callback, context) => this.addListener(event, callback, context, false);
    this.off = this.removeListener;
    this.once = (event, callback, context) => this.addListener(event, callback, context, true);
    this.emit = this.invoke;
  }

  addListener(event, callback, context, once) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push(new EventHandler(this, callback, context, once));
  }

  removeListener(event, callback) {
    if (!this._events.has(event)) {
      return;
    }
    let list = this._events.get(event);
    let index = list.findIndex(handler => handler.callback === callback);
    if (index !== -1) {
      list.splice(index, 1)
        .forEach(handler => handler.dispose());
    }
    if (list.length === 0) {
      this._events.delete(event);
    }
  }

  removeAllListeners(event) {
    if (event === undefined) {
      this._events.forEach(handlers => handlers.forEach(handler => handler.dispose()));
      this._events.clear();
    } else {
      if (!this._events.has(event)) {
        return;
      }
      let list = this._events.get(event);
      list.forEach(handler => handler.dispose());
      list.length = 0;
      this._events.delete(event);
    }
  }

  invoke(event) {
    if (!this._events.has(event)) {
      return;
    }
    let list = this._events.get(event);
    let pending = [];
    let args = Array.prototype.slice.call(arguments, 1);
    list.forEach(handler => {
      handler.callback.apply(handler.context, args);
      if (handler.once) {
        pending.push(handler);
      }
    });
    pending.forEach(handler => {
      let index = list.indexOf(handler);
      list.splice(index, 1);
      handler.dispose();
    });
    if (list.length === 0) {
      this._events.delete(event);
    }
  }

  dispose() {
    if (this._events.size === 0) {
      return;
    }
    this.removeAllListeners();
  }
}

class EventHandler {
  constructor(eventEmitter, callback, context, once) {
    this.eventEmitter = eventEmitter;
    this.callback = callback;
    this.context = context || eventEmitter;
    this.once = !!once;
  }

  dispose() {
    this.eventEmitter = undefined;
    this.callback = undefined;
    this.context = undefined;
    this.once = false;
  }
}
