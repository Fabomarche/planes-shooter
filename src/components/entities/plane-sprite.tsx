import { useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Sprite } from "pixi.js";
import { useAsset } from "../../hooks/use-asset";
import { GAME_CONFIG } from "../../constants/game-config";

/**
 * PlaneSprite component following React + Pixi.js best practices
 * - Uses custom hook for asset loading
 * - Implements proper cleanup
 * - Follows naming conventions from pixi.mdc rules
 */
export const PlaneSprite = () => {
  const { app } = useApplication();
  const spriteRef = useRef<Sprite>(null);

  // Use custom hook for asset loading with proper error handling
  const { texture, isLoading, error } = useAsset("PLANE");

  // Game loop using useTick hook for smooth animations
  useTick((ticker) => {
    if (!spriteRef.current || !texture) return;

    // Frame-independent rotation for consistent animation speed
    spriteRef.current.rotation += GAME_CONFIG.ROTATION_SPEED * ticker.deltaTime;
  });

  // Show loading state or error
  if (isLoading) {
    return null; // Could render a loading indicator here
  }

  if (error) {
    console.error("Failed to load plane texture:", error);
    return null; // Could render an error state here
  }

  if (!texture) {
    return null;
  }

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      anchor={0.5}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      scale={0.5}
    />
  );
};
