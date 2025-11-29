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

  // Image assets configuration
  private readonly USE_IMAGES = true; // Set to false to use simple shapes
  private images: {
    playerCycle?: HTMLImageElement;
    aiCycleRed?: HTMLImageElement;
    aiCycleYellow?: HTMLImageElement;
    aiCycleGreen?: HTMLImageElement;
    aiCyclePurple?: HTMLImageElement;
    arenaBg?: HTMLImageElement;
    explosion?: HTMLImageElement;
  } = {};
  private imagesLoaded = false;

  constructor() {
    console.log('GameRenderer initializing...');

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas element not found!');
      throw new Error('Canvas element not found');
    }

    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      console.error('Could not get 2D context!');
      throw new Error('Could not get 2D context');
    }

    // Set canvas size
    this.canvas.width = 1200;
    this.canvas.height = 700;
    console.log(`Canvas size: ${this.canvas.width}x${this.canvas.height}`);

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
    console.log('Game engine initialized');

    this.setupControls();
    this.setupUI();

    // Load images if enabled
    if (this.USE_IMAGES) {
      this.loadImages();
    }

    console.log('About to show menu...');
    this.showMenu();
    console.log('GameRenderer initialization complete');
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

  private loadImages(): void {
    console.log('Loading images...');
    const imagesToLoad = [
      { key: 'playerCycle', path: 'assets/images/player-cycle.png' },
      { key: 'aiCycleRed', path: 'assets/images/ai-cycle-red.png' },
      { key: 'aiCycleYellow', path: 'assets/images/ai-cycle-yellow.png' },
      { key: 'aiCycleGreen', path: 'assets/images/ai-cycle-green.png' },
      { key: 'aiCyclePurple', path: 'assets/images/ai-cycle-purple.png' },
      { key: 'arenaBg', path: 'assets/images/arena-bg.png' },
      { key: 'explosion', path: 'assets/images/explosion.png' },
    ];

    let loadedCount = 0;
    const totalImages = imagesToLoad.length;

    imagesToLoad.forEach(({ key, path }) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        console.log(`Loaded ${key} (${loadedCount}/${totalImages})`);
        if (loadedCount === totalImages) {
          this.imagesLoaded = true;
          console.log('All images loaded successfully!');
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${path}`);
        loadedCount++;
        if (loadedCount === totalImages) {
          console.log('Image loading complete (some failed)');
        }
      };
      img.src = path;
      this.images[key as keyof typeof this.images] = img;
    });
  }

  private showMenu(): void {
    const menu = document.getElementById('menu');
    if (!menu) {
      console.error('Menu element not found!');
      return;
    }

    console.log('Showing menu...');
    menu.style.display = 'block';
    console.log('Menu display set to:', menu.style.display);

    const config = this.engine.getConfig();
    const roundEl = document.getElementById('round');
    const totalRoundsEl = document.getElementById('total-rounds');

    if (roundEl) roundEl.textContent = config.currentRound.toString();
    if (totalRoundsEl) totalRoundsEl.textContent = config.totalRounds.toString();

    console.log('Menu should now be visible');
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
    // Clear canvas and draw background
    if (this.USE_IMAGES && this.imagesLoaded && this.images.arenaBg) {
      // Draw tiled background
      this.ctx.drawImage(this.images.arenaBg, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      // Draw grid when not using background image
      this.drawGrid();
    }

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
    const size = 20; // Larger size for images

    // Determine which image to use based on cycle color
    let cycleImage: HTMLImageElement | undefined;
    if (this.USE_IMAGES && this.imagesLoaded) {
      if (cycle.isPlayer) {
        cycleImage = this.images.playerCycle;
      } else {
        // Map AI cycle colors to images
        const colorMap: { [key: string]: keyof typeof this.images } = {
          '#ff0000': 'aiCycleRed',
          '#ff6600': 'aiCycleRed',
          '#ffff00': 'aiCycleYellow',
          '#ffcc00': 'aiCycleYellow',
          '#00ff00': 'aiCycleGreen',
          '#00ff66': 'aiCycleGreen',
          '#ff00ff': 'aiCyclePurple',
          '#ff66ff': 'aiCyclePurple',
        };
        const imageKey = colorMap[cycle.color];
        if (imageKey) {
          cycleImage = this.images[imageKey];
        }
      }
    }

    if (cycleImage) {
      // Draw cycle image with glow effect
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = cycle.color;
      this.ctx.drawImage(
        cycleImage,
        cycle.position.x - size / 2,
        cycle.position.y - size / 2,
        size,
        size
      );
      this.ctx.shadowBlur = 0;
    } else {
      // Fallback to simple shape
      const shapeSize = 8;
      this.ctx.fillStyle = cycle.color;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = cycle.color;

      this.ctx.fillRect(
        cycle.position.x - shapeSize / 2,
        cycle.position.y - shapeSize / 2,
        shapeSize,
        shapeSize
      );

      this.ctx.shadowBlur = 0;

      // Player indicator
      if (cycle.isPlayer) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
          cycle.position.x - shapeSize / 2 - 2,
          cycle.position.y - shapeSize / 2 - 2,
          shapeSize + 4,
          shapeSize + 4
        );
      }
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
