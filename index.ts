import { Game, Scene, Sprite, Text } from "./mgl";

const ROWS = 14;
const COLUMNS = 14;
const COLORS = 6;
const MOVE_LIMIT = 25;

export class StartScene extends Scene {
  // size and position values
  private stageWidth: number;
  private stageHeight: number;

  private tileSize: number;
  private fieldOffsetX: number;
  private fieldOffsetY: number;
  private movesX: number;
  private movesY: number;
  private moveLimitX: number;
  private movesLimitY: number;

  // game 
  private _moves: number;
  private gameOver: boolean;
  private isDone: boolean;
  private isClickable: boolean;
  private gameWon: boolean;

  private field: Sprite[][];
  private buttons: Sprite[];
  private texts: Text[];


  // sprites
  private textMoves: Text;
  private textMoveLimit: Text;

  get moves() { return this._moves; }
  set moves(value) {
    this._moves = value;
    this.textMoves.text = value.toString();
  }

  onLoad() {
    for (let i = 0; i < 6; i++) {
      this.load.image(`button-${i}`, `assets/button-${i}.png`);
      this.load.image(`tile-${i}`, `assets/tile-${i}.png`);
    }
  }

  onUpdate() {

  }

  onCreate() {
    this.stageWidth = this.game.canvas.width;
    this.stageHeight = this.game.canvas.height;

    this.tileSize = this.textures.get('tile-0').width;
    this.fieldOffsetX = Math.round((this.stageWidth - this.tileSize * 14) / 2);
    this.fieldOffsetY = Math.round(this.stageHeight / 4);
    this.movesX = Math.round(this.fieldOffsetX);
    this.movesY = Math.round(this.stageHeight / 7);
    this.moveLimitX = Math.round(this.fieldOffsetX + this.tileSize * COLUMNS);
    this.movesLimitY = Math.round(this.stageHeight / 7);

    this._moves = 0;
    this.gameOver = false;
    this.isDone = false;
    this.isClickable = false;

    this.createField();
    this.createButtons();
    this.createTexts();
    this.reveal();
  }

  createField() {
    let index = 0;
    this.field = [];
    for (let r = 0; r < ROWS; r++) {
      this.field[r] = [];
      for (let c = 0; c < COLUMNS; c++) {
        index = Math.round(Math.random() * 1000) % COLORS;
        let x = this.fieldOffsetX + c * this.tileSize;
        let y = this.fieldOffsetY + r * this.tileSize;
        let item = this.add.sprite(x, y, `tile-${index}`);
        item.data.set('row', r);
        item.data.set('column', c);
        item.data.set('color', index);
        item.data.set('x', x);
        item.data.set('y', y);
        this.field[r][c] = item;
      }
    }
  }

  createButtons() {
    this.buttons = [];
    // color buttons
    for (let index = 0; index < 3; index++) {
      let button = this.add.sprite(
        (this.stageWidth / 8) + (this.stageWidth / 4) * index,
        this.stageHeight * 12 / 16,
        `button-${index}`);
      button.data.set('color', index);
      button.setInteractive();
      this.buttons.push(button);
    }
    for (let index = 3; index < 6; index++) {
      let button = this.add.sprite(
        (this.stageWidth / 8) + (this.stageWidth / 4) * (index - 3),
        this.stageHeight * 14 / 16,
        `button-${index}`);
      button.data.set('color', index);
      button.setInteractive();
      this.buttons.push(button);
    }
    this.input.on('displayObjectDown', this.onButtonPressed, this);
  }

  createTexts() {
    this.texts = [];
    // moves
    this.textMoves = this.add.text(this.movesX, this.movesY, this.moves.toString(), { fontSize: 30 }).setOrigin(0);
    // move limit
    this.textMoveLimit = this.add.text(this.moveLimitX, this.movesLimitY, MOVE_LIMIT.toString(), { fontSize: 30 }).setOrigin(1, 0).setAnchor(-0.5, 0.5);
    this.texts.push(this.textMoves, this.textMoveLimit);
  }

  reveal() {
    let delay = 0;
    // show color buttons
    this.tweens.add({
      target: this.buttons,
      duration: 2250,
      delay: delay,
      props: {
        scaleX: {
          from: 0,
          to: 1
        },
        scaleY: {
          from: 0,
          to: 1
        }
      }
    });
    // show tiles
    for (let r = ROWS - 1; r >= 0; r--) {
      for (let c = 0; c < COLUMNS; c++) {
        let tile = this.field[r][c];
        this.tweens.add({
          target: tile,
          duration: 300,
          delay: delay,
          props: {
            y: {
              from: -this.tileSize,
              to: tile.data.get('y')
            }
          }
        });
        delay += 10;
      }
    }
    // show texts
    this.texts.forEach(text => this.tweens.add({
      target: text,
      duration: 2000,
      // delay: delay,
      props: {
        // y: {
        //   from: -text.height,
        //   to: text.y
        // },
        rotation: {
          from: 0,
          to: 360
        }
      }
    }));
    delay += 300;
    setTimeout(() => { this.isClickable = true; }, delay);
  }

  onButtonPressed(button) {
    if (this.field[0][0].data.get('color') !== button.data.get('color') && this.isClickable) {
      this.isClickable = false;
      this.moves++;
      this.flood(button.data.get('color'), 0, 0);
    }
  }

  flood(color, row, column) {
    let oldColor = this.field[row][column].data.get('color');
    let stack = [this.field[row][column]];
    let matched = [];
    while (stack.length !== 0) {
      let tile = stack.pop();
      let r = tile.data.get('row');
      let c = tile.data.get('column');
      if (matched.indexOf(tile) === -1) {
        matched.push(tile);
      }
      if (r > 0 && this.field[r - 1][c].data.get('color') === oldColor && matched.indexOf(this.field[r - 1][c]) === -1) {
        stack.push(this.field[r - 1][c]);
      }
      if (c < COLUMNS - 1 && this.field[r][c + 1].data.get('color') === oldColor && matched.indexOf(this.field[r][c + 1]) === -1) {
        stack.push(this.field[r][c + 1]);
      }
      if (r < ROWS - 1 && this.field[r + 1][c].data.get('color') === oldColor && matched.indexOf(this.field[r + 1][c]) === -1) {
        stack.push(this.field[r + 1][c]);
      }
      if (c > 0 && this.field[r][c - 1].data.get('color') === oldColor && matched.indexOf(this.field[r][c - 1]) === -1) {
        stack.push(this.field[r][c - 1]);
      }
    }
    if (matched.length > 0) {
      let len = matched.length;
      let delay = Math.round(500 / len);
      matched
        .sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))
        .forEach((sprite, index) => {
          this.timer.delayedCallback(() => {
            sprite.data.set('color', color);
            sprite.setTexture(`tile-${color}`);
          }, index * delay, this);
        });
      this.timer.delayedCallback(this.checkGameOver, delay * len, this);
    }
  }

  checkGameOver() {
    if (this.checkIsDone() && this.moves <= MOVE_LIMIT) {
      // win
      this.gameOver = true;
      this.gameWon = true;
    } else if (!this.checkIsDone() && this.moves >= MOVE_LIMIT) {
      // lose
      this.gameOver = true;
      this.gameWon = false;
    }
    if (this.gameOver) {
      this.moves = 100;
    }
    this.isClickable = true;
  }

  checkIsDone() {
    for (let r = ROWS - 1; r >= 0; r--) {
      for (let c = COLUMNS - 1; c >= 0; c--) {
        if (this.field[r][c].data.get('color') !== this.field[0][0].data.get('color')) {
          this.isDone = false;
          return false;
        }
      }
    }
    this.isDone = true;
    return true;
  }
}

export class Main {
  constructor() {
    this._game = new Game();
    this._scene = new StartScene(this._game, 'start');
  }

  private _game: Game;
  private _scene: Scene;

  start() {
    this._game.start(this._scene);
  }
}

let game = new Main();

game.start();