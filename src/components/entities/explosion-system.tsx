import { useState, useCallback } from "react";
import { ExplosionSprite } from "./explosion-sprite";
import { GAME_CONFIG } from "../../constants/game-config";

interface ExplosionData {
  id: string;
  x: number;
  y: number;
  createdAt: number;
  planeId?: string; // Reference to the plane that was hit
  planeXAtCollision?: number; // Plane X position at collision time
  planeYAtCollision?: number; // Plane Y position at collision time
}

interface ExplosionSystemProps {
  explosions: ExplosionData[];
  onRemoveExplosion: (id: string) => void;
  planeData?: {
    x: number;
    y: number;
    scale: number;
  };
  playExplosion2Sound?: () => void;
}

/**
 * ExplosionSystem component for managing multiple explosions
 * - Renders all active explosions
 * - Handles explosion removal
 * - Optimized for performance
 */
export const ExplosionSystem = ({ explosions, onRemoveExplosion, planeData, playExplosion2Sound }: ExplosionSystemProps) => {
  return (
    <>
      {explosions.map((explosion) => (
        <ExplosionSprite
          key={explosion.id}
          explosion={explosion}
          onRemove={onRemoveExplosion}
          planeData={planeData}
          playExplosion2Sound={playExplosion2Sound}
        />
      ))}
    </>
  );
};

/**
 * Custom hook for managing explosion system
 * - Handles explosion creation and removal
 * - Manages explosion lifecycle
 */
export const useExplosionSystem = () => {
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);

  const createExplosion = useCallback((x: number, y: number, planeId?: string, planeXAtCollision?: number, planeYAtCollision?: number) => {
    const newExplosion: ExplosionData = {
      id: `explosion-${Date.now()}-${Math.random()}`,
      x,
      y,
      createdAt: Date.now(),
      planeId,
      planeXAtCollision,
      planeYAtCollision,
    };

    setExplosions(prev => {
      // Limit number of explosions
      const updated = [...prev, newExplosion];
      if (updated.length > GAME_CONFIG.EXPLOSION.MAX_EXPLOSIONS) {
        return updated.slice(-GAME_CONFIG.EXPLOSION.MAX_EXPLOSIONS);
      }
      return updated;
    });
  }, []);

  const removeExplosion = useCallback((id: string) => {
    setExplosions(prev => prev.filter(explosion => explosion.id !== id));
  }, []);

  const clearAllExplosions = useCallback(() => {
    setExplosions([]);
  }, []);

  return {
    explosions,
    createExplosion,
    removeExplosion,
    clearAllExplosions,
  };
};
