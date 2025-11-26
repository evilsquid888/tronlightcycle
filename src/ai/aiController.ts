import { Cycle, Direction, Position } from '../types';
import { CollisionDetector } from '../utils/collision';

export enum AIStrategy {
  AGGRESSIVE = 'AGGRESSIVE',
  DEFENSIVE = 'DEFENSIVE',
  BALANCED = 'BALANCED'
}

export class AIController {
  private collisionDetector: CollisionDetector;
  private strategy: AIStrategy;
  private lookAheadDistance: number;

  constructor(
    strategy: AIStrategy = AIStrategy.BALANCED,
    lookAheadDistance: number = 50
  ) {
    this.collisionDetector = new CollisionDetector();
    this.strategy = strategy;
    this.lookAheadDistance = lookAheadDistance;
  }

  /**
   * Decide the next direction for an AI cycle
   */
  decideDirection(
    cycle: Cycle,
    allCycles: Cycle[],
    arenaWidth: number,
    arenaHeight: number
  ): Direction {
    const possibleDirections = this.getPossibleDirections(cycle.direction);
    const safeDirections: Array<{ direction: Direction; score: number }> = [];

    for (const direction of possibleDirections) {
      const futurePosition = this.predictPosition(
        cycle.position,
        direction,
        this.lookAheadDistance
      );

      const dangerScore = this.evaluateDanger(
        futurePosition,
        direction,
        cycle,
        allCycles,
        arenaWidth,
        arenaHeight
      );

      if (dangerScore < 100) {
        safeDirections.push({ direction, score: dangerScore });
      }
    }

    // If no safe direction, pick least dangerous
    if (safeDirections.length === 0) {
      for (const direction of possibleDirections) {
        const futurePosition = this.predictPosition(
          cycle.position,
          direction,
          cycle.speed * 2
        );

        const dangerScore = this.evaluateDanger(
          futurePosition,
          direction,
          cycle,
          allCycles,
          arenaWidth,
          arenaHeight
        );

        safeDirections.push({ direction, score: dangerScore });
      }
    }

    // Sort by score (lower is better) and pick best
    safeDirections.sort((a, b) => a.score - b.score);
    return safeDirections.length > 0 ? safeDirections[0].direction : cycle.direction;
  }

  /**
   * Get possible directions (can't reverse)
   */
  private getPossibleDirections(currentDirection: Direction): Direction[] {
    const opposite = this.getOppositeDirection(currentDirection);
    return Object.values(Direction).filter(d => d !== opposite);
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
   * Predict future position based on direction and distance
   */
  private predictPosition(
    current: Position,
    direction: Direction,
    distance: number
  ): Position {
    const delta = this.getDirectionDelta(direction);
    return {
      x: current.x + delta.x * distance,
      y: current.y + delta.y * distance
    };
  }

  /**
   * Get x,y delta for a direction
   */
  private getDirectionDelta(direction: Direction): Position {
    switch (direction) {
      case Direction.UP:
        return { x: 0, y: -1 };
      case Direction.DOWN:
        return { x: 0, y: 1 };
      case Direction.LEFT:
        return { x: -1, y: 0 };
      case Direction.RIGHT:
        return { x: 1, y: 0 };
    }
  }

  /**
   * Evaluate danger score for a position/direction (0 = safe, 100 = immediate death)
   */
  private evaluateDanger(
    position: Position,
    direction: Direction,
    cycle: Cycle,
    allCycles: Cycle[],
    arenaWidth: number,
    arenaHeight: number
  ): number {
    let dangerScore = 0;

    // Check immediate collision
    const testCycle = { ...cycle, position, direction };
    if (this.collisionDetector.checkCycleCollision(testCycle, allCycles, arenaWidth, arenaHeight)) {
      return 100;
    }

    // Evaluate distance to walls
    const wallDistance = Math.min(
      position.x,
      arenaWidth - position.x,
      position.y,
      arenaHeight - position.y
    );

    if (wallDistance < 50) {
      dangerScore += (50 - wallDistance) * 0.5;
    }

    // Evaluate distance to trails
    for (const otherCycle of allCycles) {
      if (!otherCycle.isAlive) continue;

      const nearest = this.collisionDetector.getNearestTrailSegment(
        position,
        otherCycle.trail
      );

      if (nearest && nearest.distance < 100) {
        dangerScore += (100 - nearest.distance) * 0.3;
      }
    }

    // Strategy-specific adjustments
    if (this.strategy === AIStrategy.AGGRESSIVE) {
      // Move towards player
      const player = allCycles.find(c => c.isPlayer && c.isAlive);
      if (player) {
        const distanceToPlayer = Math.hypot(
          position.x - player.position.x,
          position.y - player.position.y
        );
        dangerScore -= distanceToPlayer * 0.01; // Slightly prefer getting closer
      }
    } else if (this.strategy === AIStrategy.DEFENSIVE) {
      // Prefer open spaces
      dangerScore -= wallDistance * 0.1;
    }

    return Math.max(0, dangerScore);
  }

  /**
   * Set AI strategy
   */
  setStrategy(strategy: AIStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Get current strategy
   */
  getStrategy(): AIStrategy {
    return this.strategy;
  }
}
