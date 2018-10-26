export class EventEmitter {
  constructor() {
    this._events = new Map();
    this.on = (event, callback, context) => this.addListener(event, callback, context, false);
    this.off = this.removeListener;
    this.once = (event, callback, context) => this.addListener(event, callback, context, true);
    this.emit = this.invoke;
  }

  private _events: Map<string, Array<EventHandler>>;

  readonly on: Function;

  readonly off: Function;

  readonly once: Function;

  readonly emit: Function;

  addListener(eventType: string, callback: Function, context?: any, once?: boolean): void {
    if (!this._events.has(eventType)) {
      this._events.set(eventType, new Array());
    }
    this._events.get(eventType).push(new EventHandler(this, callback, context, once));
  }

  removeListener(eventType: string, callback: Function): void {
    if (!this._events.has(eventType)) {
      return;
    }
    let list = this._events.get(eventType);
    let index = list.findIndex(handler => handler.callback === callback);
    if (index !== -1) {
      list.splice(index, 1)
        .forEach(handler => handler.dispose());
    }
    if (list.length === 0) {
      this._events.delete(eventType);
    }
  }

  removeAllListeners(eventType?: string): void {
    if (eventType === undefined) {
      this._events.forEach(handlers => handlers.forEach(handler => handler.dispose()));
      this._events.clear();
    } else {
      if (!this._events.has(eventType)) {
        return;
      }
      let list = this._events.get(eventType);
      list.forEach(handler => handler.dispose());
      list.length = 0;
      this._events.delete(eventType);
    }
  }

  invoke(eventType: string): void {
    if (!this._events.has(eventType)) {
      return;
    }
    let list = this._events.get(eventType);
    let pending = [];
    list.forEach(handler => {
      handler.invoke(...[...arguments].slice(1));
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
      this._events.delete(eventType);
    }
  }
}

class EventHandler {
  constructor(private _eventEmitter: EventEmitter, private _callback: Function, private _context?: any, private _once?: boolean) {
    this._context = _context || _eventEmitter;
    this._once = !!_once;
  }

  get callback() { return this._callback; }

  get context() { return this._context; }

  get once() { return this._once; }

  invoke(...params: any[]): void {
    this.callback.apply(this.context, params);
  }

  dispose() {
    if (this._eventEmitter === undefined) {
      return;
    }
    this._eventEmitter = undefined;
    this._callback = undefined;
    this._context = undefined;
  }

}
