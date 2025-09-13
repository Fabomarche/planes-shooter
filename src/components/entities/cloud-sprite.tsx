import { useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Sprite } from "pixi.js";
import { useAsset } from "../../hooks/use-asset";

interface CloudSpriteProps {
  x?: number;
  y?: number;
  scale?: number;
  speed?: number;
  direction?: 'left' | 'right';
}

/**
 * CloudSprite component following React + Pixi.js best practices
 * - Uses custom hook for asset loading
 * - Implements smooth horizontal movement
 * - Configurable position, scale, and speed
 */
export const CloudSprite = ({ 
  x = 0, 
  y = 0, 
  scale = 0.3, 
  speed = 0.5,
  direction = 'left'
}: CloudSpriteProps) => {
  const { app } = useApplication();
  const spriteRef = useRef<Sprite>(null);

  // Use custom hook for asset loading with proper error handling
  const { texture, isLoading, error } = useAsset("CLOUD");

  // Game loop using useTick hook for smooth movement
  useTick((ticker) => {
    if (!spriteRef.current || !texture) return;

    // Frame-independent movement for consistent speed
    const moveSpeed = speed * ticker.deltaTime;
    spriteRef.current.x += direction === 'left' ? -moveSpeed : moveSpeed;

    // Reset position when cloud goes off screen
    if (direction === 'left' && spriteRef.current.x < -spriteRef.current.width) {
      spriteRef.current.x = app.screen.width + spriteRef.current.width;
    } else if (direction === 'right' && spriteRef.current.x > app.screen.width + spriteRef.current.width) {
      spriteRef.current.x = -spriteRef.current.width;
    }
  });

  // Show loading state or error
  if (isLoading) {
    return null;
  }

  if (error) {
    console.error("Failed to load cloud texture:", error);
    return null;
  }

  if (!texture) {
    return null;
  }

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      anchor={0.5}
      x={x}
      y={y}
      scale={scale}
      alpha={0.8} // Slightly transparent for depth effect
    />
  );
};
