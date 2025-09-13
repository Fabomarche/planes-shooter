import { useRef } from "react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useTick } from "@pixi/react";
import { GAME_CONFIG } from "../../constants/game-config";

interface CollisionDebugProps {
  x: number;
  y: number;
  scale: number;
  width?: number;
  height?: number;
}

/**
 * CollisionDebug component for visualizing collision areas
 * - Shows collision box for debugging purposes
 * - Only renders when DEBUG.SHOW_COLLISION_BOXES is true
 * - Uses semi-transparent red rectangle
 */
export const CollisionDebug = ({ 
  x, 
  y, 
  scale, 
  width = 200, 
  height = 100 
}: CollisionDebugProps) => {
  const graphicsRef = useRef<PixiGraphics>(null);

  useTick(() => {
    if (!graphicsRef.current || !GAME_CONFIG.DEBUG.SHOW_COLLISION_BOXES) return;

    const g = graphicsRef.current;
    g.clear();

    // Calculate actual collision box dimensions
    const actualWidth = width * scale;
    const actualHeight = height * scale;

    // Draw collision box
    g.beginFill(GAME_CONFIG.DEBUG.COLLISION_BOX_COLOR, GAME_CONFIG.DEBUG.COLLISION_BOX_ALPHA);
    g.drawRect(-actualWidth / 2, -actualHeight / 2, actualWidth, actualHeight);
    g.endFill();

    // Draw border
    g.lineStyle(2, GAME_CONFIG.DEBUG.COLLISION_BOX_COLOR, 1);
    g.drawRect(-actualWidth / 2, -actualHeight / 2, actualWidth, actualHeight);

    // Update position
    g.x = x;
    g.y = y;
  });

  // Don't render if debug is disabled
  if (!GAME_CONFIG.DEBUG.SHOW_COLLISION_BOXES) {
    return null;
  }

  return (
    <pixiGraphics
      ref={graphicsRef}
      x={x}
      y={y}
      interactive={false}
    />
  );
};
