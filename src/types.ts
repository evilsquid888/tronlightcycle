export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface Trail {
  segments: Position[];
  color: string;
}

export interface Cycle {
  id: string;
  position: Position;
  direction: Direction;
  color: string;
  trail: Trail;
  isAlive: boolean;
  isPlayer: boolean;
  speed: number;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  ROUND_OVER = 'ROUND_OVER',
  GAME_OVER = 'GAME_OVER'
}

export interface GameConfig {
  arenaWidth: number;
  arenaHeight: number;
  cycleSize: number;
  baseSpeed: number;
  numAICycles: number;
  currentRound: number;
  totalRounds: number;
}
