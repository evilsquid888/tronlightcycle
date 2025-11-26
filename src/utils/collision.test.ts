import { CollisionDetector } from './collision';
import { Cycle, Direction } from '../types';

describe('CollisionDetector', () => {
  let detector: CollisionDetector;

  beforeEach(() => {
    detector = new CollisionDetector(5);
  });

  describe('checkWallCollision', () => {
    it('should detect collision with left wall', () => {
      const position = { x: -1, y: 100 };
      expect(detector.checkWallCollision(position, 800, 600)).toBe(true);
    });

    it('should detect collision with right wall', () => {
      const position = { x: 801, y: 100 };
      expect(detector.checkWallCollision(position, 800, 600)).toBe(true);
    });

    it('should detect collision with top wall', () => {
      const position = { x: 100, y: -1 };
      expect(detector.checkWallCollision(position, 800, 600)).toBe(true);
    });

    it('should detect collision with bottom wall', () => {
      const position = { x: 100, y: 601 };
      expect(detector.checkWallCollision(position, 800, 600)).toBe(true);
    });

    it('should not detect collision when inside arena', () => {
      const position = { x: 400, y: 300 };
      expect(detector.checkWallCollision(position, 800, 600)).toBe(false);
    });
  });

  describe('checkTrailCollision', () => {
    it('should detect collision with trail segment', () => {
      const position = { x: 100, y: 100 };
      const trail = {
        segments: [
          { x: 98, y: 98 },
          { x: 100, y: 100 },
          { x: 102, y: 102 }
        ],
        color: '#ff0000'
      };
      expect(detector.checkTrailCollision(position, trail)).toBe(true);
    });

    it('should not detect collision when far from trail', () => {
      const position = { x: 100, y: 100 };
      const trail = {
        segments: [
          { x: 200, y: 200 },
          { x: 300, y: 300 }
        ],
        color: '#ff0000'
      };
      expect(detector.checkTrailCollision(position, trail)).toBe(false);
    });

    it('should handle empty trail', () => {
      const position = { x: 100, y: 100 };
      const trail = { segments: [], color: '#ff0000' };
      expect(detector.checkTrailCollision(position, trail)).toBe(false);
    });
  });

  describe('checkCycleCollision', () => {
    it('should detect wall collision for cycle', () => {
      const cycle: Cycle = {
        id: 'test-1',
        position: { x: -10, y: 100 },
        direction: Direction.LEFT,
        color: '#0000ff',
        trail: { segments: [], color: '#0000ff' },
        isAlive: true,
        isPlayer: true,
        speed: 2
      };

      expect(detector.checkCycleCollision(cycle, [cycle], 800, 600)).toBe(true);
    });

    it('should detect collision with other cycle trail', () => {
      const cycle1: Cycle = {
        id: 'cycle-1',
        position: { x: 100, y: 100 },
        direction: Direction.RIGHT,
        color: '#0000ff',
        trail: { segments: [], color: '#0000ff' },
        isAlive: true,
        isPlayer: true,
        speed: 2
      };

      const cycle2: Cycle = {
        id: 'cycle-2',
        position: { x: 200, y: 200 },
        direction: Direction.UP,
        color: '#ff0000',
        trail: {
          segments: [{ x: 98, y: 98 }, { x: 100, y: 100 }],
          color: '#ff0000'
        },
        isAlive: true,
        isPlayer: false,
        speed: 2
      };

      expect(detector.checkCycleCollision(cycle1, [cycle1, cycle2], 800, 600)).toBe(true);
    });

    it('should not collide with own recent trail', () => {
      const cycle: Cycle = {
        id: 'cycle-1',
        position: { x: 100, y: 100 },
        direction: Direction.RIGHT,
        color: '#0000ff',
        trail: {
          segments: [
            { x: 90, y: 100 },
            { x: 92, y: 100 },
            { x: 94, y: 100 },
            { x: 96, y: 100 },
            { x: 98, y: 100 }
          ],
          color: '#0000ff'
        },
        isAlive: true,
        isPlayer: true,
        speed: 2
      };

      expect(detector.checkCycleCollision(cycle, [cycle], 800, 600)).toBe(false);
    });

    it('should not detect collision when no obstacles', () => {
      const cycle: Cycle = {
        id: 'cycle-1',
        position: { x: 400, y: 300 },
        direction: Direction.RIGHT,
        color: '#0000ff',
        trail: { segments: [], color: '#0000ff' },
        isAlive: true,
        isPlayer: true,
        speed: 2
      };

      expect(detector.checkCycleCollision(cycle, [cycle], 800, 600)).toBe(false);
    });
  });

  describe('getNearestTrailSegment', () => {
    it('should find nearest trail segment', () => {
      const position = { x: 100, y: 100 };
      const trail = {
        segments: [
          { x: 50, y: 50 },
          { x: 95, y: 95 },
          { x: 200, y: 200 }
        ],
        color: '#ff0000'
      };

      const result = detector.getNearestTrailSegment(position, trail);
      expect(result).not.toBeNull();
      expect(result!.segment).toEqual({ x: 95, y: 95 });
    });

    it('should return null for empty trail', () => {
      const position = { x: 100, y: 100 };
      const trail = { segments: [], color: '#ff0000' };

      expect(detector.getNearestTrailSegment(position, trail)).toBeNull();
    });
  });
});
