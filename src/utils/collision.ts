import { Position, Cycle, Trail } from '../types';

export class CollisionDetector {
  private readonly gridSize: number;

  constructor(gridSize: number = 5) {
    this.gridSize = gridSize;
  }

  /**
   * Check if a position collides with arena walls
   */
  checkWallCollision(position: Position, arenaWidth: number, arenaHeight: number): boolean {
    return (
      position.x < 0 ||
      position.x >= arenaWidth ||
      position.y < 0 ||
      position.y >= arenaHeight
    );
  }

  /**
   * Check if a position collides with a trail
   */
  checkTrailCollision(position: Position, trail: Trail): boolean {
    for (const segment of trail.segments) {
      if (this.positionsOverlap(position, segment)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a cycle collides with any trails (including its own after some distance)
   */
  checkCycleCollision(
    cycle: Cycle,
    allCycles: Cycle[],
    arenaWidth: number,
    arenaHeight: number
  ): boolean {
    // Check wall collision
    if (this.checkWallCollision(cycle.position, arenaWidth, arenaHeight)) {
      return true;
    }

    // Check collision with all trails
    for (const otherCycle of allCycles) {
      if (!otherCycle.isAlive) continue;

      // For own trail, skip the last few segments to avoid immediate collision
      const segmentsToCheck = cycle.id === otherCycle.id
        ? otherCycle.trail.segments.slice(0, -10)
        : otherCycle.trail.segments;

      for (const segment of segmentsToCheck) {
        if (this.positionsOverlap(cycle.position, segment)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if two positions overlap within grid tolerance
   */
  private positionsOverlap(pos1: Position, pos2: Position): boolean {
    return (
      Math.abs(pos1.x - pos2.x) < this.gridSize &&
      Math.abs(pos1.y - pos2.y) < this.gridSize
    );
  }

  /**
   * Get the nearest trail segment to a position
   */
  getNearestTrailSegment(position: Position, trail: Trail): { segment: Position; distance: number } | null {
    if (trail.segments.length === 0) return null;

    let nearest = trail.segments[0];
    let minDistance = this.getDistance(position, nearest);

    for (const segment of trail.segments) {
      const distance = this.getDistance(position, segment);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = segment;
      }
    }

    return { segment: nearest, distance: minDistance };
  }

  /**
   * Calculate distance between two positions
   */
  private getDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
