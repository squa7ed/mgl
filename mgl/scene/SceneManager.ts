import { Game } from "../Game";
import { Scene } from "./Scene";
import { SceneStatus } from "./System";

export class SceneManager {
  constructor(private _game: Game) {
    this._scenes = new Map();
    _game.events.once('boot', this.boot, this);
    _game.events.once('exit', this.dispose, this);
  }

  private _scenes: Map<string, Scene>;

  private boot() {
    let scenes = this._game.config.scenes;
    if (!Array.isArray(scenes)) {
      scenes = [scenes];
    }
    scenes.forEach((ctor, i) => {
      let scene = new ctor(this._game)
      let key = ctor.name;
      if (this._scenes.has(key)) {
        throw Error(`duplicate scene ${key}`);
      }
      scene.sys.boot();
      this._scenes.set(key, scene);
    });
  }

  start(key: string) {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    scene.sys.status = SceneStatus.START;
    // init
    scene.sys.status = SceneStatus.INIT;
    scene.onInit();
    // load
    scene.sys.status = SceneStatus.LOAD;
    scene.onLoad();
    if (scene.load.pending > 0) {
      scene.events.once('loaded',
        // create
        (s: Scene) => {
          s.sys.status = SceneStatus.CREATE;
          s.onCreate();
          s.sys.status = SceneStatus.RUNNING;
        }, scene);
    } else {
      scene.sys.status = SceneStatus.CREATE;
      scene.onCreate();
      scene.sys.status = SceneStatus.RUNNING;
    }
  }

  stop(key) {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    scene.events.emit('stop');
    scene.sys.status = SceneStatus.STOP;
  }

  pause(key) {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    scene.events.emit('pause');
    scene.sys.status = SceneStatus.PAUSED;
  }

  update(time, dt) {
    //TODO
    this._game.context.clearRect(0, 0, 320, 568);
    this._scenes.forEach((scene, key) => {
      if (scene.sys.status >= SceneStatus.CREATE && scene.sys.status < SceneStatus.PAUSED) {
        scene.sys.update(time, dt);
      }
      if (scene.sys.status >= SceneStatus.CREATE && scene.sys.status < SceneStatus.STOP) {
        scene.sys.render();
      }
    });
  }

  dispose() {
    if (this._game === undefined) {
      return;
    }
    this._scenes.forEach(scene => scene.events.emit('dispose'));
    this._scenes.clear();
    this._scenes = undefined;
    this._game = undefined;
  }
}
