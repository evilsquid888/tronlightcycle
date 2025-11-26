import { GameEngine } from './gameEngine';
import { Direction, GameState } from '../types';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine({
      arenaWidth: 800,
      arenaHeight: 600,
      cycleSize: 10,
      baseSpeed: 2,
      numAICycles: 3,
      currentRound: 1,
      totalRounds: 5
    });
  });

  describe('initialization', () => {
    it('should create game engine with config', () => {
      expect(engine.getConfig()).toEqual({
        arenaWidth: 800,
        arenaHeight: 600,
        cycleSize: 10,
        baseSpeed: 2,
        numAICycles: 3,
        currentRound: 1,
        totalRounds: 5
      });
    });

    it('should start in MENU state', () => {
      expect(engine.getGameState()).toBe(GameState.MENU);
    });
  });

  describe('initRound', () => {
    it('should create player and AI cycles', () => {
      engine.initRound();
      const cycles = engine.getCycles();

      expect(cycles.length).toBe(4); // 1 player + 3 AI
      expect(cycles.filter(c => c.isPlayer).length).toBe(1);
      expect(cycles.filter(c => !c.isPlayer).length).toBe(3);
    });

    it('should set game state to PLAYING', () => {
      engine.initRound();
      expect(engine.getGameState()).toBe(GameState.PLAYING);
    });

    it('should initialize all cycles as alive', () => {
      engine.initRound();
      const cycles = engine.getCycles();

      expect(cycles.every(c => c.isAlive)).toBe(true);
    });
  });

  describe('setPlayerDirection', () => {
    beforeEach(() => {
      engine.initRound();
    });

    it('should change player direction', () => {
      const player = engine.getCycles().find(c => c.isPlayer);
      const initialDirection = player!.direction;

      engine.setPlayerDirection(Direction.UP);

      expect(player!.direction).not.toBe(initialDirection);
    });

    it('should prevent reversing direction', () => {
      const player = engine.getCycles().find(c => c.isPlayer);
      player!.direction = Direction.RIGHT;

      engine.setPlayerDirection(Direction.LEFT);

      // Should not change to opposite direction
      expect(player!.direction).toBe(Direction.RIGHT);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      engine.initRound();
    });

    it('should move cycles', () => {
      const player = engine.getCycles().find(c => c.isPlayer);
      const initialX = player!.position.x;

      engine.update();

      // Position should have changed
      expect(player!.position.x).not.toBe(initialX);
    });

    it('should add positions to trail', () => {
      engine.update();
      const player = engine.getCycles().find(c => c.isPlayer);

      expect(player!.trail.segments.length).toBeGreaterThan(0);
    });

    it('should detect wall collisions', () => {
      const player = engine.getCycles().find(c => c.isPlayer);
      player!.position = { x: -10, y: 300 };
      player!.direction = Direction.LEFT;

      engine.update();

      expect(player!.isAlive).toBe(false);
    });
  });

  describe('isPlayerAlive', () => {
    beforeEach(() => {
      engine.initRound();
    });

    it('should return true when player is alive', () => {
      expect(engine.isPlayerAlive()).toBe(true);
    });

    it('should return false when player is dead', () => {
      const player = engine.getCycles().find(c => c.isPlayer);
      player!.isAlive = false;

      expect(engine.isPlayerAlive()).toBe(false);
    });
  });

  describe('nextRound', () => {
    beforeEach(() => {
      engine.initRound();
    });

    it('should advance to next round', () => {
      const initialRound = engine.getConfig().currentRound;

      const hasNext = engine.nextRound();

      expect(hasNext).toBe(true);
      expect(engine.getConfig().currentRound).toBe(initialRound + 1);
    });

    it('should increase AI cycle count', () => {
      const initialCount = engine.getConfig().numAICycles;

      engine.nextRound();

      expect(engine.getConfig().numAICycles).toBe(initialCount + 1);
    });

    it('should not exceed max AI cycles', () => {
      engine.getConfig().numAICycles = 5;

      engine.nextRound();

      expect(engine.getConfig().numAICycles).toBe(5);
    });

    it('should return false and set GAME_OVER on last round', () => {
      engine.getConfig().currentRound = 5;
      engine.getConfig().totalRounds = 5;

      const hasNext = engine.nextRound();

      expect(hasNext).toBe(false);
      expect(engine.getGameState()).toBe(GameState.GAME_OVER);
    });
  });

  describe('reset', () => {
    it('should reset game to initial state', () => {
      engine.initRound();
      engine.nextRound();
      engine.nextRound();

      engine.reset();

      expect(engine.getConfig().currentRound).toBe(1);
      expect(engine.getConfig().numAICycles).toBe(3);
      expect(engine.getGameState()).toBe(GameState.MENU);
      expect(engine.getCycles().length).toBe(0);
    });
  });
});
