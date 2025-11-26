# Tron Light Cycle Game

A single-player Tron light cycle game built with Electron and TypeScript. Race against 3-5 AI opponents and try to be the last cycle standing!

## Features

- Single player vs AI opponents
- Progressive difficulty with 3-5 cycles to compete against
- Classic Tron light cycle gameplay mechanics
- Collision detection with trails and arena walls
- Smart AI opponents with multiple difficulty levels
- Retro cyberpunk aesthetic

## Installation

```bash
npm install
```

## Development

```bash
# Build TypeScript
npm run build

# Run the game
npm start

# Watch mode for development
npm run watch
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch
```

## Image Assets Required

Place the following images in the `assets/images/` directory:

1. **player-cycle.png** - Blue player light cycle (128x128px)
2. **ai-cycle-red.png** - Red AI cycle (128x128px)
3. **ai-cycle-yellow.png** - Yellow AI cycle (128x128px)
4. **ai-cycle-green.png** - Green AI cycle (128x128px)
5. **ai-cycle-purple.png** - Purple AI cycle (128x128px)
6. **arena-bg.png** - Grid arena background (1920x1080px)
7. **explosion.png** - Explosion effect sprite (512x512px)

### Image Generation Prompts

Use these prompts with your favorite AI image generator:

- **Player/AI Cycles**: "Futuristic Tron light cycle motorcycle in [COLOR] color, side view, glowing neon trails, sleek angular design, cyberpunk aesthetic, transparent background, game sprite, 128x128 pixels"
- **Arena**: "Dark Tron grid arena background, black floor with glowing blue grid lines, futuristic cyberpunk aesthetic, digital world, top-down view, seamless texture, 1920x1080"
- **Explosion**: "Neon explosion effect sprite sheet, electric particles, glowing fragments, Tron style, cyberpunk aesthetic, transparent background, 512x512 pixels"

## How to Play

- Use **Arrow Keys** or **WASD** to change direction
- Avoid hitting walls, trails (yours or opponents')
- Be the last cycle alive to win the round
- Complete all rounds to win the game

## Game Mechanics

- Each cycle leaves a solid light trail behind it
- Cycles move at constant speed
- Collision with any trail or wall destroys the cycle
- AI opponents use pathfinding and strategic behavior
- Difficulty increases with each round

## License

MIT
