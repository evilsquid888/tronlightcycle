import { AIController, AIStrategy } from './aiController';
import { Cycle, Direction } from '../types';

describe('AIController', () => {
  let aiController: AIController;

  beforeEach(() => {
    aiController = new AIController(AIStrategy.BALANCED);
  });

  describe('decideDirection', () => {
    it('should avoid walls', () => {
      const cycle: Cycle = {
        id: 'ai-1',
        position: { x: 10, y: 300 },
        direction: Direction.LEFT,
        color: '#ff0000',
        trail: { segments: [], color: '#ff0000' },
        isAlive: true,
        isPlayer: false,
        speed: 2
      };

      const direction = aiController.decideDirection(cycle, [cycle], 800, 600);

      // Should not continue going left towards the wall
      expect(direction).not.toBe(Direction.LEFT);
    });

    it('should avoid trails', () => {
      const aiCycle: Cycle = {
        id: 'ai-1',
        position: { x: 100, y: 100 },
        direction: Direction.RIGHT,
        color: '#ff0000',
        trail: { segments: [], color: '#ff0000' },
        isAlive: true,
        isPlayer: false,
        speed: 2
      };

      const otherCycle: Cycle = {
        id: 'other-1',
        position: { x: 200, y: 200 },
        direction: Direction.UP,
        color: '#00ff00',
        trail: {
          segments: [
            { x: 150, y: 100 },
            { x: 160, y: 100 },
            { x: 170, y: 100 }
          ],
          color: '#00ff00'
        },
        isAlive: true,
        isPlayer: false,
        speed: 2
      };

      const direction = aiController.decideDirection(
        aiCycle,
        [aiCycle, otherCycle],
        800,
        600
      );

      // Should pick a safe direction
      expect([Direction.UP, Direction.DOWN, Direction.RIGHT]).toContain(direction);
    });

    it('should not reverse direction', () => {
      const cycle: Cycle = {
        id: 'ai-1',
        position: { x: 400, y: 300 },
        direction: Direction.RIGHT,
        color: '#ff0000',
        trail: { segments: [], color: '#ff0000' },
        isAlive: true,
        isPlayer: false,
        speed: 2
      };

      const direction = aiController.decideDirection(cycle, [cycle], 800, 600);

      // Should never reverse
      expect(direction).not.toBe(Direction.LEFT);
    });

    it('should pick least dangerous option when all directions risky', () => {
      const cycle: Cycle = {
        id: 'ai-1',
        position: { x: 50, y: 50 },
        direction: Direction.RIGHT,
        color: '#ff0000',
        trail: {
          segments: [
            { x: 30, y: 50 },
            { x: 40, y: 50 }
          ],
          color: '#ff0000'
        },
        isAlive: true,
        isPlayer: false,
        speed: 2
      };

      const direction = aiController.decideDirection(cycle, [cycle], 800, 600);

      // Should still return a valid direction
      expect(Object.values(Direction)).toContain(direction);
      expect(direction).not.toBe(Direction.LEFT); // Can't reverse
    });
  });

  describe('strategy behavior', () => {
    it('should use aggressive strategy', () => {
      const aggressive = new AIController(AIStrategy.AGGRESSIVE);
      expect(aggressive.getStrategy()).toBe(AIStrategy.AGGRESSIVE);
    });

    it('should use defensive strategy', () => {
      const defensive = new AIController(AIStrategy.DEFENSIVE);
      expect(defensive.getStrategy()).toBe(AIStrategy.DEFENSIVE);
    });

    it('should allow strategy changes', () => {
      aiController.setStrategy(AIStrategy.AGGRESSIVE);
      expect(aiController.getStrategy()).toBe(AIStrategy.AGGRESSIVE);

      aiController.setStrategy(AIStrategy.DEFENSIVE);
      expect(aiController.getStrategy()).toBe(AIStrategy.DEFENSIVE);
    });
  });
});
