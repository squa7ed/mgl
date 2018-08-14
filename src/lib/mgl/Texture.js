
export default class Texture {
  constructor(manager, key, source) {
    this.manager = manager;
    this.key = key;
    this.source = source;
    this.width = source.width;
    this.height = source.height;
  }

  dispose() {
    if (this.manager === undefined) {
      return;
    }
    this.manager = undefined;
    this.source = undefined;
  }
}

