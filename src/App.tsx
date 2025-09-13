import { Application, extend } from "@pixi/react";
import { Container, Sprite } from "pixi.js";
import { GameScene } from "./components/scenes/game-scene";
import { GAME_CONFIG } from "./constants/game-config";

// Extend @pixi/react with Pixi.js components
extend({
  Container,
  Sprite,
});

/**
 * Main App component following React + Pixi.js best practices
 * - Uses centralized configuration
 * - Separates concerns with scene components
 * - Follows pixi.mdc structure guidelines
 */
export default function App() {
  return (
    <Application background={GAME_CONFIG.BACKGROUND_COLOR} resizeTo={window}>
      <GameScene />
    </Application>
  );
}
