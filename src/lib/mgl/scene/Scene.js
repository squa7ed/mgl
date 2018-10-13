import EventEmitter from "../EventEmitter";
import { DisplayList, DisplayObjectFactory } from '../displayobjects';
import { Timer } from '../timers';
import Loader from '../Loader';

export default class Scene extends EventEmitter {
  constructor(game, key) {
    super();
    this._game = game;
    this._key = key;
    this._displayList = new DisplayList(this);
    this._input = game.input;
    this._timer = new Timer(this);
    this._textures = game.textures;
    this._load = new Loader(this);
    this._add = new DisplayObjectFactory(this);
  }

  get game() { return this._game; }
  get key() { return this._key; }
  get displayList() { return this._displayList; }
  get input() { return this._input; }
  get timer() { return this._timer; }
  get textures() { return this._textures; }
  get load() { return this._load; }
  get add() { return this._add; }

  preload() { }

  create() { }

  update() { }

  render(context) { }
}