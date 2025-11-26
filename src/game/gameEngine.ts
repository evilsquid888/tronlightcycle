import { Cycle, Direction, GameConfig, GameState, Position } from '../types';
import { CollisionDetector } from '../utils/collision';
import { AIController, AIStrategy } from '../ai/aiController';

export class GameEngine {
  private config: GameConfig;
  private cycles: Cycle[] = [];
  private gameState: GameState = GameState.MENU;
  private collisionDetector: CollisionDetector;
  private aiControllers: Map<string, AIController> = new Map();
  private readonly cycleColors = ['#ff0000', '#ffff00', '#00ff00', '#ff00ff'];

  constructor(config: GameConfig) {
    this.config = config;
    this.collisionDetector = new CollisionDetector();
  }

  /**
   * Initialize a new round
   */
  initRound(): void {
    this.cycles = [];
    this.aiControllers.clear();

    // Create player cycle
    const playerCycle = this.createCycle(
      'player',
      { x: 200, y: this.config.arenaHeight / 2 },
      Direction.RIGHT,
      '#00ffff',
      true
    );
    this.cycles.push(playerCycle);

    // Create AI cycles
    const numAI = Math.min(this.config.numAICycles, this.cycleColors.length);
    for (let i = 0; i < numAI; i++) {
      const aiCycle = this.createAICycle(i, numAI);
      this.cycles.push(aiCycle);

      // Assign strategy based on difficulty
      const strategy = this.getStrategyForRound(this.config.currentRound);
      this.aiControllers.set(aiCycle.id, new AIController(strategy));
    }

    this.gameState = GameState.PLAYING;
  }

  /**
   * Create a cycle
   */
  private createCycle(
    id: string,
    position: Position,
    direction: Direction,
    color: string,
    isPlayer: boolean
  ): Cycle {
    return {
      id,
      position: { ...position },
      direction,
      color,
      trail: { segments: [], color },
      isAlive: true,
      isPlayer,
      speed: this.config.baseSpeed
    };
  }

  /**
   * Create an AI cycle with position based on index
   */
  private createAICycle(index: number, total: number): Cycle {
    const spacing = this.config.arenaWidth / (total + 1);
    const position: Position = {
      x: this.config.arenaWidth - 200,
      y: spacing * (index + 1)
    };

    const directions = [Direction.LEFT, Direction.UP, Direction.DOWN];
    const direction = directions[index % directions.length];

    return this.createCycle(
      `ai-${index}`,
      position,
      direction,
      this.cycleColors[index % this.cycleColors.length],
      false
    );
  }

  /**
   * Get AI strategy based on round number
   */
  private getStrategyForRound(round: number): AIStrategy {
    if (round <= 2) return AIStrategy.DEFENSIVE;
    if (round <= 4) return AIStrategy.BALANCED;
    return AIStrategy.AGGRESSIVE;
  }

  /**
   * Update game state for one frame
   */
  update(): void {
    if (this.gameState !== GameState.PLAYING) return;

    // Update AI decisions
    for (const cycle of this.cycles) {
      if (!cycle.isAlive || cycle.isPlayer) continue;

      const aiController = this.aiControllers.get(cycle.id);
      if (aiController) {
        cycle.direction = aiController.decideDirection(
          cycle,
          this.cycles,
          this.config.arenaWidth,
          this.config.arenaHeight
        );
      }
    }

    // Move all cycles
    for (const cycle of this.cycles) {
      if (!cycle.isAlive) continue;

      // Add current position to trail
      cycle.trail.segments.push({ ...cycle.position });

      // Move cycle
      this.moveCycle(cycle);

      // Check collisions
      if (this.collisionDetector.checkCycleCollision(
        cycle,
        this.cycles,
        this.config.arenaWidth,
        this.config.arenaHeight
      )) {
        cycle.isAlive = false;
      }
    }

    // Check for round end
    this.checkRoundEnd();
  }

  /**
   * Move a cycle in its current direction
   */
  private moveCycle(cycle: Cycle): void {
    switch (cycle.direction) {
      case Direction.UP:
        cycle.position.y -= cycle.speed;
        break;
      case Direction.DOWN:
        cycle.position.y += cycle.speed;
        break;
      case Direction.LEFT:
        cycle.position.x -= cycle.speed;
        break;
      case Direction.RIGHT:
        cycle.position.x += cycle.speed;
        break;
    }
  }

  /**
   * Check if round should end
   */
  private checkRoundEnd(): void {
    const aliveCycles = this.cycles.filter(c => c.isAlive);

    if (aliveCycles.length <= 1) {
      this.gameState = GameState.ROUND_OVER;
    }
  }

  /**
   * Change player direction
   */
  setPlayerDirection(direction: Direction): void {
    const player = this.cycles.find(c => c.isPlayer);
    if (!player || !player.isAlive) return;

    // Prevent reversing
    const opposite = this.getOppositeDirection(player.direction);
    if (direction !== opposite) {
      player.direction = direction;
    }
  }

  /**
   * Get opposite direction
   */
  private getOppositeDirection(direction: Direction): Direction {
    const opposites = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT
    };
    return opposites[direction];
  }

  /**
   * Check if player won the round
   */
  isPlayerAlive(): boolean {
    const player = this.cycles.find(c => c.isPlayer);
    return player ? player.isAlive : false;
  }

  /**
   * Advance to next round
   */
  nextRound(): boolean {
    if (this.config.currentRound < this.config.totalRounds) {
      this.config.currentRound++;
      this.config.numAICycles = Math.min(this.config.numAICycles + 1, 5);
      return true;
    }
    this.gameState = GameState.GAME_OVER;
    return false;
  }

  /**
   * Reset game
   */
  reset(): void {
    this.config.currentRound = 1;
    this.config.numAICycles = 3;
    this.cycles = [];
    this.aiControllers.clear();
    this.gameState = GameState.MENU;
  }

  // Getters
  getCycles(): Cycle[] {
    return this.cycles;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  setGameState(state: GameState): void {
    this.gameState = state;
  }

  getConfig(): GameConfig {
    return this.config;
  }
}
