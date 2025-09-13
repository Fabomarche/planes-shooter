import { useRef, useEffect } from "react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useTick } from "@pixi/react";
import { GAME_CONFIG } from "../../constants/game-config";

interface BulletData {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  createdAt: number;
}

interface BulletSpriteProps {
  bullet: BulletData;
  onRemove: (id: string) => void;
}

/**
 * BulletSprite component for individual bullet projectiles
 * - Applies realistic physics with gravity
 * - Has lifetime and collision detection
 * - Optimized for performance
 */
export const BulletSprite = ({ bullet, onRemove }: BulletSpriteProps) => {
  const graphicsRef = useRef<PixiGraphics>(null);

  useTick((ticker) => {
    if (!graphicsRef.current) return;

    const deltaTime = ticker.deltaTime / 60; // Convert to seconds
    const gravity = GAME_CONFIG.BULLET.GRAVITY;

    // Apply gravity to vertical velocity
    bullet.velocityY += gravity * deltaTime;

    // Update position
    bullet.x += bullet.velocityX * deltaTime;
    bullet.y += bullet.velocityY * deltaTime;

    // Update graphics position
    graphicsRef.current.x = bullet.x;
    graphicsRef.current.y = bullet.y;

    // Check if bullet is out of bounds or expired
    const now = Date.now();
    const isExpired = now - bullet.createdAt > GAME_CONFIG.BULLET.LIFETIME;
    const isOutOfBounds = 
      bullet.x < -50 || 
      bullet.x > 1200 || 
      bullet.y > 800;

    if (isExpired || isOutOfBounds) {
      onRemove(bullet.id);
    }
  });

  const draw = (g: PixiGraphics) => {
    g.clear();
    
    // Draw bullet as a small circle
    g.beginFill(GAME_CONFIG.BULLET.COLOR, 1);
    g.drawCircle(0, 0, GAME_CONFIG.BULLET.SIZE);
    g.endFill();
    
    // Add a small glow effect
    g.beginFill(GAME_CONFIG.BULLET.COLOR, 0.3);
    g.drawCircle(0, 0, GAME_CONFIG.BULLET.SIZE * 1.5);
    g.endFill();
  };

  return (
    <pixiGraphics
      ref={graphicsRef}
      x={bullet.x}
      y={bullet.y}
      draw={draw}
      interactive={false}
    />
  );
};
