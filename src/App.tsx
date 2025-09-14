import { Application, extend } from "@pixi/react";
import { Container, Sprite, Graphics, Text } from "pixi.js";
import { GameScene } from "./components/scenes/game-scene";
import { GAME_CONFIG } from "./constants/game-config";
import { AudioProvider } from "./contexts/audio-context";
import { ConfigButton } from "./components/ui/config-button";
import { ConfigModal } from "./components/ui/config-modal";
import { useConfigModal } from "./hooks/use-config-modal";
import { useScreenDimensions } from "./hooks/use-screen-dimensions";

// Extend @pixi/react with Pixi.js components
extend({
  Container,
  Sprite,
  Graphics,
  Text,
});

/**
 * Main App component following React + Pixi.js best practices
 * - Uses centralized configuration
 * - Separates concerns with scene components
 * - Follows pixi.mdc structure guidelines
 */
const AppContent = () => {
  const { isOpen, openModal, closeModal } = useConfigModal();
  const { width, height } = useScreenDimensions();

  return (
    <>
      <GameScene />
      <ConfigButton 
        x={20} 
        y={20} 
        onClick={openModal} 
      />
      {isOpen && (
        <ConfigModal
          x={width / 2 - 150}
          y={height / 2 - 100}
          width={300}
          height={200}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AudioProvider>
      <Application background={GAME_CONFIG.BACKGROUND_COLOR} resizeTo={window}>
        <AppContent />
      </Application>
    </AudioProvider>
  );
}
