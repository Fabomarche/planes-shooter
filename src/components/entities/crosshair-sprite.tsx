import { useRef } from "react";
import { Sprite } from "pixi.js";
import { useAsset } from "../../hooks/use-asset";

interface CrosshairSpriteProps {
  x: number;
  y: number;
  scale?: number;
}

/**
 * CrosshairSprite component for anti-aircraft cannon crosshair
 * - Follows mouse cursor position
 * - Uses aim.png image asset
 * - Optimized for performance
 */
export const CrosshairSprite = ({ x, y, scale = 1 }: CrosshairSpriteProps) => {
  const spriteRef = useRef<Sprite>(null);

  // Use custom hook for asset loading with proper error handling
  const { texture, isLoading, error } = useAsset("AIM");

  // Show loading state or error
  if (isLoading) {
    return null;
  }

  if (error) {
    console.error("Failed to load aim texture:", error);
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
      zIndex={1000}
      interactive={false}
      cursor="crosshair"
    />
  );
};
