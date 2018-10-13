import { Game, Scene } from "./lib/mgl";
const ROWS = 14;
const COLUMNS = 14;
const COLORS = 6;
const MOVE_LIMIT = 25;

class StartScene extends Scene {
  preload() {
    for (let i = 0; i < 6; i++) {
      this.load.image(`button-${i}`, `assets/button-${i}.png`);
      this.load.image(`tile-${i}`, `assets/tile-${i}.png`);
    }
  }

  create() {
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;

    this.tileSize = this.textures.get('tile-0').width;
    this.fieldOffsetX = Math.round((this.width - this.tileSize * 14) / 2);
    this.fieldOffsetY = Math.round(this.height / 4);
    this.movesX = Math.round(this.width / 8);
    this.movesY = Math.round(this.height / 6);
    this.moveLimitX = Math.round(this.width * 5 / 8);
    this.movesLimitY = Math.round(this.height / 6);

    this._moves = 0;
    this.gameOver = false;
    this.isDone = false;
    this.isClickable = true;

    this.createField();
    this.createButtons();
    this.createTexts();
  }

  createField() {
    let index = 0;
    this.field = [];
    for (let r = 0; r < ROWS; r++) {
      this.field[r] = [];
      for (let c = 0; c < COLUMNS; c++) {
        index = Math.round(Math.random() * 1000) % COLORS;
        let item = this.add.sprite(this.fieldOffsetX + c * this.tileSize, this.fieldOffsetY + r * this.tileSize, `tile-${index}`);
        item.data.set('row', r);
        item.data.set('column', c);
        item.data.set('color', index);
        this.field[r][c] = item;
      }
    }
  }

  createButtons() {
    this.buttons = [];
    // color buttons
    for (let index = 0; index < 3; index++) {
      let button = this.add.sprite(
        (this.width / 8) + (this.width / 4) * index,
        this.height * 12 / 16,
        `button-${index}`);
      button.data.set('color', index);
      this.input.enable(button);
      this.buttons.push(button);
    }
    for (let index = 3; index < 6; index++) {
      let button = this.add.sprite(
        (this.width / 8) + (this.width / 4) * (index - 3),
        this.height * 14 / 16,
        `button-${index}`);
      button.data.set('color', index);
      this.input.enable(button);
      this.buttons.push(button);
    }
    this.input.on('mousedown', this.onButtonPressed, this);
  }

  createTexts() {
    // moves
    this.textMoves = this.add.text(this.movesX, this.movesY, this.moves, { fontSize: 30 });
    // move limit
    this.textMovelImit = this.add.text(this.moveLimitX, this.movesLimitY, MOVE_LIMIT, { fontSize: 30 });
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
            sprite.texture = this.textures.get(`tile-${color}`);
          }, index * delay, this);
        })
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

  get moves() { return this._moves; }
  set moves(value) {
    this._moves = value;
    this.textMoves.text = value;
  }

}

export default class Main {
  constructor() {
    this._game = new Game();
    this._scene = new StartScene(this._game, 'start');
  }

  start() {
    this._game.start(this._scene);
  }
}