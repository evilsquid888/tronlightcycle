import { GameEngine } from './game/gameEngine';
import { Direction, GameState, Cycle } from './types';

class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private engine: GameEngine;
  private animationFrame: number = 0;
  private lastTime: number = 0;
  private readonly targetFPS = 60;
  private readonly frameTime = 1000 / this.targetFPS;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    // Set canvas size
    this.canvas.width = 1200;
    this.canvas.height = 700;

    // Initialize game engine
    this.engine = new GameEngine({
      arenaWidth: this.canvas.width,
      arenaHeight: this.canvas.height,
      cycleSize: 10,
      baseSpeed: 2,
      numAICycles: 3,
      currentRound: 1,
      totalRounds: 5
    });

    this.setupControls();
    this.setupUI();
    this.showMenu();
  }

  private setupControls(): void {
    document.addEventListener('keydown', (e) => {
      if (this.engine.getGameState() !== GameState.PLAYING) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.engine.setPlayerDirection(Direction.UP);
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.engine.setPlayerDirection(Direction.DOWN);
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.engine.setPlayerDirection(Direction.LEFT);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.engine.setPlayerDirection(Direction.RIGHT);
          e.preventDefault();
          break;
      }
    });
  }

  private setupUI(): void {
    const startBtn = document.getElementById('start-btn')!;
    startBtn.addEventListener('click', () => {
      this.startGame();
    });
  }

  private showMenu(): void {
    const menu = document.getElementById('menu')!;
    menu.style.display = 'block';

    const config = this.engine.getConfig();
    document.getElementById('round')!.textContent = config.currentRound.toString();
    document.getElementById('total-rounds')!.textContent = config.totalRounds.toString();
  }

  private hideMenu(): void {
    const menu = document.getElementById('menu')!;
    menu.style.display = 'none';
  }

  private startGame(): void {
    this.hideMenu();
    this.engine.initRound();
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  private gameLoop(currentTime: number): void {
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= this.frameTime) {
      this.update();
      this.render();
      this.lastTime = currentTime - (deltaTime % this.frameTime);
    }

    if (this.engine.getGameState() === GameState.PLAYING) {
      this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    } else if (this.engine.getGameState() === GameState.ROUND_OVER) {
      this.handleRoundOver();
    }
  }

  private update(): void {
    this.engine.update();
    this.updateUI();
  }

  private updateUI(): void {
    const config = this.engine.getConfig();
    const cycles = this.engine.getCycles();
    const aliveCount = cycles.filter(c => c.isAlive).length;

    document.getElementById('round')!.textContent = config.currentRound.toString();
    document.getElementById('alive-count')!.textContent = aliveCount.toString();
  }

  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.drawGrid();

    // Draw cycles and trails
    const cycles = this.engine.getCycles();
    for (const cycle of cycles) {
      this.drawTrail(cycle);
      if (cycle.isAlive) {
        this.drawCycle(cycle);
      }
    }
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = '#001a1a';
    this.ctx.lineWidth = 1;

    const gridSize = 50;

    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawCycle(cycle: Cycle): void {
    const size = 8;

    // Cycle body
    this.ctx.fillStyle = cycle.color;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = cycle.color;

    this.ctx.fillRect(
      cycle.position.x - size / 2,
      cycle.position.y - size / 2,
      size,
      size
    );

    // Reset shadow
    this.ctx.shadowBlur = 0;

    // Player indicator
    if (cycle.isPlayer) {
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        cycle.position.x - size / 2 - 2,
        cycle.position.y - size / 2 - 2,
        size + 4,
        size + 4
      );
    }
  }

  private drawTrail(cycle: Cycle): void {
    if (cycle.trail.segments.length < 2) return;

    this.ctx.strokeStyle = cycle.color;
    this.ctx.lineWidth = 4;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = cycle.color;

    this.ctx.beginPath();
    this.ctx.moveTo(cycle.trail.segments[0].x, cycle.trail.segments[0].y);

    for (let i = 1; i < cycle.trail.segments.length; i++) {
      this.ctx.lineTo(cycle.trail.segments[i].x, cycle.trail.segments[i].y);
    }

    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  private handleRoundOver(): void {
    const playerAlive = this.engine.isPlayerAlive();
    const menuContent = document.getElementById('menu-content')!;
    const startBtn = document.getElementById('start-btn')!;

    if (playerAlive) {
      const hasNext = this.engine.nextRound();

      if (hasNext) {
        menuContent.innerHTML = `
          <p class="winner-text">ROUND WON!</p>
          <p>Advancing to Round ${this.engine.getConfig().currentRound}</p>
          <p>AI Opponents: ${this.engine.getConfig().numAICycles}</p>
        `;
        startBtn.textContent = 'NEXT ROUND';
      } else {
        menuContent.innerHTML = `
          <p class="winner-text">GAME COMPLETE!</p>
          <p>You defeated all opponents!</p>
          <p>You are the champion!</p>
        `;
        startBtn.textContent = 'PLAY AGAIN';
        this.engine.reset();
      }
    } else {
      menuContent.innerHTML = `
        <p class="loser-text">GAME OVER</p>
        <p>You were eliminated in Round ${this.engine.getConfig().currentRound}</p>
        <p>Try again!</p>
      `;
      startBtn.textContent = 'RESTART';
      this.engine.reset();
    }

    this.showMenu();
  }
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new GameRenderer();
});
