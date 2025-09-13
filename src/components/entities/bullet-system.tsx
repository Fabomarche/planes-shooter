import { useState, useCallback } from "react";
import { BulletSprite } from "./bullet-sprite";
import { GAME_CONFIG } from "../../constants/game-config";

interface BulletData {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  createdAt: number;
}

interface BulletSystemProps {
  bullets: BulletData[];
  onRemoveBullet: (id: string) => void;
  onBulletCollision?: (bullet: BulletData, collisionX: number, collisionY: number) => void;
  planeData?: {
    x: number;
    y: number;
    scale: number;
  };
}

/**
 * BulletSystem component for managing multiple bullets
 * - Renders all active bullets
 * - Handles bullet removal
 * - Optimized for performance
 */
export const BulletSystem = ({ bullets, onRemoveBullet, onBulletCollision, planeData }: BulletSystemProps) => {
  return (
    <>
      {bullets.map((bullet) => (
        <BulletSprite
          key={bullet.id}
          bullet={bullet}
          onRemove={onRemoveBullet}
          onCollision={onBulletCollision}
          planeData={planeData}
        />
      ))}
    </>
  );
};

/**
 * Custom hook for managing bullet system
 * - Handles bullet creation and removal
 * - Applies physics calculations
 * - Manages bullet lifecycle
 */
export const useBulletSystem = () => {
  const [bullets, setBullets] = useState<BulletData[]>([]);

  const createBullet = useCallback((startX: number, startY: number, targetX: number, targetY: number) => {
    // Calculate direction vector
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction and apply speed
    const velocityX = (dx / distance) * GAME_CONFIG.BULLET.SPEED;
    const velocityY = (dy / distance) * GAME_CONFIG.BULLET.SPEED;

    const newBullet: BulletData = {
      id: `bullet-${Date.now()}-${Math.random()}`,
      x: startX,
      y: startY,
      velocityX,
      velocityY,
      createdAt: Date.now(),
    };

    setBullets(prev => {
      // Limit number of bullets
      const updated = [...prev, newBullet];
      if (updated.length > GAME_CONFIG.BULLET.MAX_BULLETS) {
        return updated.slice(-GAME_CONFIG.BULLET.MAX_BULLETS);
      }
      return updated;
    });
  }, []);

  const removeBullet = useCallback((id: string) => {
    setBullets(prev => prev.filter(bullet => bullet.id !== id));
  }, []);

  const clearAllBullets = useCallback(() => {
    setBullets([]);
  }, []);

  return {
    bullets,
    createBullet,
    removeBullet,
    clearAllBullets,
  };
};
