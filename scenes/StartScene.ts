import { Scene, Text } from "../mgl/index";

export class StartScene extends Scene {

  private stageWidth: number;

  private stageHeight: number;

  private textStart: Text;

  private textQuit: Text;

  onLoad(): void {
  }
  
  onCreate(): void {
    this.stageWidth = this.game.canvas.width;
    this.stageHeight = this.game.canvas.height;

    this.textStart = this.add.text(this.stageWidth / 4, this.stageHeight / 2, 'Start', { fontSize: 16 }).setOrigin(0.5);
    this.input.enable(this.textStart);
    this.textStart.on('pointerDown', this.onStartButtonPressed, this);
    this.textQuit = this.add.text(this.stageWidth * 3 / 4, this.stageHeight / 2, 'Quit', { fontSize: 16 }).setOrigin(0.5);
    this.input.enable(this.textQuit);
    this.textQuit.on('pointerDown', this.onQuitButtonPressed, this);
  }

  onStartButtonPressed(): void {
    this.game.scene.stop('StartScene');
    this.game.scene.start('GameScene');
  }

  onQuitButtonPressed(): void {
    console.debug('Not implemented.');
  }

  onUpdate(time: number, dt: number): void {
  }


}