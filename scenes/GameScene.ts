import { Scene, Sprite, Text } from "../mgl/index";

const ROWS = 14;
const COLUMNS = 14;
const COLORS = 6;
const MOVE_LIMIT = 25;

export class GameScene extends Scene {
  // size and position values
  private stageWidth: number;
  private stageHeight: number;

  private tileSize: number;
  private buttonSize: number;
  private fieldOffsetX: number;
  private fieldOffsetY: number;
  private buttonsOffsetY: number;
  private movesX: number;
  private movesY: number;

  // game 
  private _moves: number;
  private gameOver: boolean;
  private isDone: boolean;
  private isClickable: boolean;
  private gameWon: boolean;

  private field: Sprite[][];
  private buttons: Sprite[];


  // sprites
  private textMoves: Text;

  get moves() { return this._moves; }
  set moves(value) {
    this._moves = value;
    this.textMoves.text = value.toString();
    if (value < 5) {
      this.textMoves.style.color = '#ff0000';
    }
  }

  onLoad() {
    let size = this.game.canvas.width <= 320 ? 'small' : this.game.canvas.width <= 375 ? 'medium' : 'large';
    for (let i = 0; i < 6; i++) {
      this.load.image(`button-${i}`, `assets/${size}/button-${i}.png`);
      this.load.image(`tile-${i}`, `assets/${size}/tile-${i}.png`);
    }
    this.load.sound('click-fail', 'assets/click-fail.mp3');
    this.load.sound('click-success', 'assets/click-success.mp3');
    this.load.sound('lose', 'assets/lose.mp3');
    this.load.sound('win', 'assets/win.mp3');
  }

  onCreate() {
    this.stageWidth = this.game.canvas.width;
    this.stageHeight = this.game.canvas.height;
    this._moves = MOVE_LIMIT;
    this.gameOver = false;
    this.isDone = false;
    this.isClickable = false;

    this.tileSize = this.textures.get('tile-0').width;
    this.buttonSize = this.textures.get('button-0').width;
    this.buttonsOffsetY = Math.ceil(this.stageHeight - 2 * (this.buttonSize + this.tileSize)) - this.tileSize;
    this.fieldOffsetX = Math.round((this.stageWidth - this.tileSize * COLUMNS) / 2);
    this.fieldOffsetY = this.buttonsOffsetY - this.tileSize * ROWS;
    this.movesX = Math.round(this.stageWidth / 2);
    this.movesY = Math.round(this.fieldOffsetY / 2);
    console.debug(this);

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
    let fieldWidth = COLUMNS * this.tileSize;
    let cnt = Math.floor((fieldWidth + this.buttonSize) / (this.buttonSize * 1.5));
    let gap = (fieldWidth - cnt * this.buttonSize) / (cnt - 1);
    for (let index = 0; index < COLORS; index++) {
      let x = (index % cnt) + 1 === cnt ? this.fieldOffsetX + fieldWidth - this.buttonSize : this.fieldOffsetX + (index % cnt) * (this.buttonSize + gap);
      let y = this.buttonsOffsetY + Math.floor(index / cnt) * (this.buttonSize + this.tileSize) + this.tileSize;
      let button = this.add.sprite(x, y, `button-${index}`);
      button.data.set('color', index)
      button.setInteractive();
      this.buttons.push(button);
    }
    this.input.on('displayObjectDown', this.onButtonPressed, this);
  }

  createTexts() {
    this.textMoves = this.add.text(this.movesX, this.movesY, this.moves.toString(), { fontSize: 36 }).setOrigin(0.5).setAnchor(0);
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
    this.tweens.add({
      target: this.textMoves,
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
    });
    delay += 300;
    setTimeout(() => { this.isClickable = true; }, delay);
  }

  onButtonPressed(button) {
    if (!this.isClickable) {
      return;
    }
    let oldColor = this.field[0][0].data.get('color');
    let color = button.data.get('color');
    if (oldColor === color) {
      this.sound.play('click-fail');
      return;
    }
    this.sound.play('click-success');
    this.startFlood(color);
  }

  startFlood(color: string) {
    this.isClickable = false;
    this.moves--;
    this.flood(color, 0, 0);
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
    if (this.checkIsDone() && this.moves >= 0) {
      // win
      this.gameOver = true;
      this.gameWon = true;
      this.sound.play('win');
    } else if (!this.checkIsDone() && this.moves <= 0) {
      // lose
      this.gameOver = true;
      this.gameWon = false;
      this.sound.play('lose');
    }
    if (this.gameOver) {
      this.textMoves.style.fontSize = 16;
      this.textMoves.text = this.gameWon ? '胜利！' : '失败！';
      this.textMoves.text += '点击以重新开始。';
      this.textMoves.setInteractive();
      this.textMoves.once('pointerDown', () => this.game.scene.start('GameScene'), this);
    } else {
      this.isClickable = true;
    }
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

  onUpdate() {

  }
}