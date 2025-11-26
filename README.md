# Tron Light Cycle Game

A single-player Tron light cycle game built with Electron and TypeScript. Race against 3-5 AI opponents and try to be the last cycle standing!

## Project Status

✅ **Complete and Tested**
- Game code: Fully implemented
- Tests: 63/63 passing
- Images: All 7 assets included (high resolution)
- Build: Successful
- Git: Repository initialized with full commit history

⚠️ **Known Issue: WSL2 + Electron**
- Electron GUI apps have compatibility issues with WSL2
- **Solution:** Run from Windows PowerShell/CMD (see Troubleshooting below)

## Features

- Single player vs AI opponents
- Progressive difficulty with 5 rounds (3-5 AI cycles)
- Classic Tron light cycle gameplay mechanics
- Comprehensive collision detection (walls, trails, self-collision prevention)
- Smart AI with 3 strategies (Defensive, Balanced, Aggressive)
- Retro cyberpunk aesthetic with neon glow effects
- Smooth 60 FPS rendering
- Full test coverage (63 unit + integration tests)

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

### Running on WSL2 vs Windows

**⚠️ Major Challenge: Electron GUI apps have significant compatibility issues with WSL2.**

#### The Problem
- WSL2 is a Linux subsystem without native GUI support
- Electron requires proper initialization of GUI frameworks (X11, Wayland, or native Windows)
- Even with X11 forwarding configured, Electron's `require('electron')` often fails
- The electron module returns a file path instead of the API object in WSL2

#### Why This Happens
1. **WSL2 Architecture**: WSL2 runs a real Linux kernel in a lightweight VM
2. **GUI Limitations**: No native display server - relies on X11 forwarding or WSLg
3. **Electron Expectations**: Electron expects a native GUI environment
4. **Module Loading**: The electron npm package behaves differently in WSL vs native environments

#### Recommended Solutions

**Option 1: Run from Windows** (Easiest and Most Reliable) ⭐
```cmd
# Since your project is in /mnt/c/dev/tronlight (C:\dev\tronlight)
# Open Windows PowerShell or CMD
cd C:\dev\tronlight
npm install
npm run build
npm start
```

**Option 2: Use WSLg** (Windows 11 only)
- WSLg provides native GUI support for WSL2
- Update WSL: `wsl --update`
- Restart WSL: `wsl --shutdown` then reopen terminal
- Should work better than traditional X11 forwarding

**Option 3: Hybrid Development**
- Develop and edit code in WSL2 (great Linux tools!)
- Build in WSL: `npm run build`
- Run from Windows: Open PowerShell and `npm start`

### Menu Not Appearing / Only See Black Box

If the game window opens but you only see a black canvas with a grid:

1. **Open Developer Tools** (F12 or Ctrl+Shift+I)
2. **Check the Console** for error messages
3. **Look for these log messages**:
   - "GameRenderer initializing..."
   - "Canvas size: 1200x700"
   - "Game engine initialized"
   - "About to show menu..."
   - "Menu should now be visible"

4. **Common Issues**:
   - JavaScript not loading: Check if `dist/renderer.js` exists
   - Menu display CSS: Menu should have `display: block` when visible
   - Missing elements: Check browser console for "element not found" errors

5. **Quick Fixes**:
   ```bash
   # Rebuild the project
   npm run build
   
   # Restart the game
   npm start
   ```

6. **Verify tests pass**:
   ```bash
   npm test
   # Should show: 63/63 tests passing
   ```

### XInput Error on WSL2

If you see errors like `ERROR:xinput.cc(2297)`, this is a harmless X11 warning about input buffer handling. However, if the GUI doesn't appear at all, see "Running on WSL2" above.

### Game Won't Start

1. Make sure you've built the project: `npm run build`
2. Check that Node.js and npm are installed: `node --version && npm --version`
3. Try reinstalling dependencies: `rm -rf node_modules && npm install`
4. If on WSL2, **strongly recommend** running from Windows PowerShell instead

### Controls Not Working

- Make sure the game has started (menu should be hidden, cycles visible)
- Click on the game window to ensure it has focus
- Use Arrow Keys or WASD to control your light cycle
- You cannot reverse direction (no 180° turns)

### Performance Issues

- The game targets 60 FPS
- If laggy, try closing other applications
- Check browser DevTools Performance tab
- High-res images (2048x2048) should be fine for desktop
## License

MIT
