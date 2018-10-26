import { EventEmitter } from "../EventEmitter";
import { DisplayList } from '../displayobjects/DisplayList';
import { Loader } from '../Loader';
import { InputManager } from "../InputManager";
import { Game } from "../Game";
import { TextureManager } from "../textures/TextureManager";
import { DisplayObjectFactory } from "../displayobjects/DisplayObjectFactory";
import { Timer } from "../timers/Timer";

export abstract class Scene {
  constructor(protected readonly game: Game, private _key: string) {
    this._displayList = new DisplayList(this);
    this._events = new EventEmitter();
    // this._input = _game.input;
    this._timer = new Timer(this);
    // this._textures = _game.textures;
    this._textures = game.textures;
    this._add = new DisplayObjectFactory(this);
    this._input = game.input;
    this._load = new Loader(this);
  }

  private _displayList: DisplayList;

  private _events: EventEmitter;

  private _input: InputManager;

  private _timer: Timer;

  private _textures: TextureManager;

  private _load: Loader;

  private _add: DisplayObjectFactory;

  get key() { return this._key; }

  get displayList() { return this._displayList; }

  get events() { return this._events; }

  get input() { return this._input; }

  get timer() { return this._timer; }

  get textures() { return this._textures; }

  get load() { return this._load; }

  get add() { return this._add; }

  abstract onLoad(): void;

  abstract onCreate(): void;

  abstract onUpdate(time: number, dt: number): void;
}