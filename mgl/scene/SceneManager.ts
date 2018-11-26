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

  private _renderWidth: number;
  private _renderHeight: number;
  private _renderBackground: string;
  private _renderContext: CanvasRenderingContext2D;

  private boot() {
    this._renderWidth = this._game.config.width ? this._game.config.width : this._game.canvas.width;
    this._renderHeight = this._game.config.height ? this._game.config.height : this._game.canvas.height;
    this._renderBackground = this._game.config.background ? this._game.config.background : "#ffffff";
    this._renderContext = this._game.canvas.getContext('2d');

    let scenes = this._game.config.scenes;
    if (!Array.isArray(scenes)) {
      scenes = [scenes];
    }
    scenes.forEach((config) => {
      if (this._scenes.has(config.key)) {
        throw Error(`duplicate scene ${config.key}`);
      }
      let scene = new config.ctor(this._game, config.key)
      scene.sys.boot();
      this._scenes.set(config.key, scene);
    });
  }

  start(key: string) {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    scene.sys.status = SceneStatus.START;
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
    this._renderContext.fillStyle = this._renderBackground;
    this._renderContext.fillRect(0, 0, this._renderWidth, this._renderHeight);
    this._scenes.forEach((scene, key) => {
      if (scene.sys.status >= SceneStatus.CREATE && scene.sys.status < SceneStatus.PAUSED) {
        scene.sys.update(time, dt);
      }
      if (scene.sys.status >= SceneStatus.CREATE && scene.sys.status < SceneStatus.STOP) {
        scene.sys.render(this._renderContext);
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
