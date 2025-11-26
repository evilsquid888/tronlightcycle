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

You'll need to generate these 7 images and place them in the `assets/images/` directory:

### 1. player-cycle.png
"Futuristic Tron light cycle motorcycle in electric blue color, side view, glowing neon trails, sleek angular design, cyberpunk aesthetic, transparent background, game sprite, 128x128 pixels"

### 2. ai-cycle-red.png
"Futuristic Tron light cycle motorcycle in bright red/orange color, side view, glowing neon trails, sleek angular design, cyberpunk aesthetic, transparent background, game sprite, 128x128 pixels"

### 3. ai-cycle-yellow.png
"Futuristic Tron light cycle motorcycle in electric yellow color, side view, glowing neon trails, sleek angular design, cyberpunk aesthetic, transparent background, game sprite, 128x128 pixels"

### 4. ai-cycle-green.png
"Futuristic Tron light cycle motorcycle in neon green color, side view, glowing neon trails, sleek angular design, cyberpunk aesthetic, transparent background, game sprite, 128x128 pixels"

### 5. ai-cycle-purple.png
"Futuristic Tron light cycle motorcycle in purple/magenta color, side view, glowing neon trails, sleek angular design, cyberpunk aesthetic, transparent background, game sprite, 128x128 pixels"

### 6. arena-bg.png
"Dark Tron grid arena background, black floor with glowing blue grid lines, futuristic cyberpunk aesthetic, digital world, top-down view, seamless texture, 1920x1080"

### 7. explosion.png
"Neon explosion effect sprite sheet, electric particles, glowing fragments, Tron style, cyberpunk aesthetic, transparent background, 512x512 pixels"

**Note:** The game is fully playable without these images - it uses colored geometric shapes as placeholders. The images are optional visual enhancements!

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

## Troubleshooting

### XInput Error on WSL2

If you see errors like `ERROR:xinput.cc(2297)` when running on WSL2, this is a harmless warning about X11 input handling. The game will work perfectly fine.

**Solutions:**
- Use `npm start` - automatically filters these warnings
- Use `npm run start:verbose` - to see all output including warnings
- These errors don't affect gameplay or functionality

### Game Won't Start

1. Make sure you've built the project: `npm run build`
2. Check that Node.js and npm are installed
3. Try reinstalling dependencies: `rm -rf node_modules && npm install`

## License

MIT
