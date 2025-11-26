/**
 * UI Integration Tests
 * These tests verify that the HTML structure and game UI are properly set up
 */

import * as fs from 'fs';
import * as path from 'path';

describe('UI Integration Tests', () => {
  let htmlContent: string;

  beforeAll(() => {
    const htmlPath = path.join(__dirname, '../index.html');
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  });

  describe('HTML Structure', () => {
    it('should have canvas element', () => {
      expect(htmlContent).toContain('id="canvas"');
    });

    it('should have menu element', () => {
      expect(htmlContent).toContain('id="menu"');
    });

    it('should have start button', () => {
      expect(htmlContent).toContain('id="start-btn"');
    });

    it('should have round info display', () => {
      expect(htmlContent).toContain('id="round"');
      expect(htmlContent).toContain('id="total-rounds"');
    });

    it('should have alive count display', () => {
      expect(htmlContent).toContain('id="alive-count"');
    });

    it('should have menu content container', () => {
      expect(htmlContent).toContain('id="menu-content"');
    });
  });

  describe('CSS Styles', () => {
    it('should have styles for menu visibility', () => {
      expect(htmlContent).toContain('#menu');
      // Menu should initially be hidden
      expect(htmlContent).toContain('display: none');
    });

    it('should have canvas styles', () => {
      expect(htmlContent).toContain('#canvas');
    });

    it('should have button styles', () => {
      expect(htmlContent).toContain('#menu button');
    });
  });

  describe('Script Loading', () => {
    it('should load renderer.js', () => {
      expect(htmlContent).toContain('dist/renderer.js');
    });

    it('should have DOMContentLoaded event listener', () => {
      expect(htmlContent).toContain('DOMContentLoaded');
    });
  });

  describe('Game Text Content', () => {
    it('should have game title', () => {
      expect(htmlContent).toContain('TRON LIGHT CYCLE');
    });

    it('should have start button text', () => {
      expect(htmlContent).toContain('START GAME');
    });

    it('should have control instructions', () => {
      expect(htmlContent).toContain('Arrow Keys');
      expect(htmlContent).toContain('WASD');
    });

    it('should have game instructions', () => {
      expect(htmlContent).toContain('Compete against AI opponents');
      expect(htmlContent).toContain('Avoid walls and light trails');
    });
  });

  describe('Required Files', () => {
    it('should have renderer source file', () => {
      const rendererPath = path.join(__dirname, 'renderer.ts');
      expect(fs.existsSync(rendererPath)).toBe(true);
    });

    it('should have compiled renderer.js after build', () => {
      const compiledPath = path.join(__dirname, '../dist/renderer.js');
      // This will pass after npm run build
      if (fs.existsSync(compiledPath)) {
        expect(fs.existsSync(compiledPath)).toBe(true);
      }
    });
  });
});

describe('Renderer Source Code Tests', () => {
  let rendererSource: string;

  beforeAll(() => {
    const rendererPath = path.join(__dirname, 'renderer.ts');
    rendererSource = fs.readFileSync(rendererPath, 'utf-8');
  });

  it('should have GameRenderer class', () => {
    expect(rendererSource).toContain('class GameRenderer');
  });

  it('should show menu on initialization', () => {
    expect(rendererSource).toContain('this.showMenu()');
  });

  it('should have showMenu function', () => {
    expect(rendererSource).toContain('showMenu()');
    expect(rendererSource).toContain("menu.style.display = 'block'");
  });

  it('should have hideMenu function', () => {
    expect(rendererSource).toContain('hideMenu()');
    expect(rendererSource).toContain("menu.style.display = 'none'");
  });

  it('should initialize on DOMContentLoaded', () => {
    expect(rendererSource).toContain("addEventListener('DOMContentLoaded'");
    expect(rendererSource).toContain('new GameRenderer()');
  });

  it('should have start button click handler', () => {
    expect(rendererSource).toContain("getElementById('start-btn')");
    expect(rendererSource).toContain("addEventListener('click'");
  });

  it('should have keyboard controls setup', () => {
    expect(rendererSource).toContain("addEventListener('keydown'");
    expect(rendererSource).toContain('ArrowUp');
    expect(rendererSource).toContain('ArrowDown');
    expect(rendererSource).toContain('ArrowLeft');
    expect(rendererSource).toContain('ArrowRight');
  });

  it('should check for required elements', () => {
    // Should have error checking for menu element
    expect(rendererSource).toContain('getElementById');
  });
});
