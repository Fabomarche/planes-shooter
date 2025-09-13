import { useRef } from "react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useTick } from "@pixi/react";
import { GAME_CONFIG } from "../../constants/game-config";
import { useScreenDimensions } from "../../hooks/use-screen-dimensions";

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
  onCollision?: (
    bullet: BulletData,
    collisionX: number,
    collisionY: number,
  ) => void;
  planeData?: {
    x: number;
    y: number;
    scale: number;
  };
}

/**
 * BulletSprite component for individual bullet projectiles
 * - Applies realistic physics with gravity
 * - Has lifetime and collision detection
 * - Optimized for performance
 */
export const BulletSprite = ({
  bullet,
  onRemove,
  onCollision,
  planeData,
}: BulletSpriteProps) => {
  const graphicsRef = useRef<PixiGraphics>(null);
  const { width: screenWidth, height: screenHeight } = useScreenDimensions();

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

    // Check collision with plane
    if (onCollision && planeData) {
      const planeWidth = GAME_CONFIG.PLANE.COLLISION_WIDTH * planeData.scale;
      const planeHeight = GAME_CONFIG.PLANE.COLLISION_HEIGHT * planeData.scale;
      const bulletRadius = GAME_CONFIG.BULLET.SIZE;

      const planeLeft = planeData.x - planeWidth / 2;
      const planeRight = planeData.x + planeWidth / 2;
      const planeTop = planeData.y - planeHeight / 2;
      const planeBottom = planeData.y + planeHeight / 2;

      const isColliding =
        bullet.x >= planeLeft - bulletRadius &&
        bullet.x <= planeRight + bulletRadius &&
        bullet.y >= planeTop - bulletRadius &&
        bullet.y <= planeBottom + bulletRadius;

      if (isColliding) {
        onCollision(bullet, bullet.x, bullet.y);
        onRemove(bullet.id);
        return;
      }
    }

    // Check if bullet is out of bounds or expired
    const now = Date.now();
    const isExpired = now - bullet.createdAt > GAME_CONFIG.BULLET.LIFETIME;
    const isOutOfBounds =
      bullet.x < -50 ||
      bullet.x > screenWidth + 50 ||
      bullet.y > screenHeight + 50;

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

    // Draw collision debug circle if enabled
    if (GAME_CONFIG.DEBUG.SHOW_COLLISION_BOXES) {
      g.lineStyle(1, GAME_CONFIG.DEBUG.COLLISION_BOX_COLOR, 1);
      g.drawCircle(0, 0, GAME_CONFIG.BULLET.SIZE);
    }
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
