import { useState, useCallback } from "react";
import { GAME_CONFIG } from "../constants/game-config";

interface PlaneState {
  health: number;
  isAlive: boolean;
  isDestroyed: boolean;
  position: {
    x: number;
    y: number;
    scale: number;
  };
}

/**
 * Custom hook for managing plane state including health and destruction
 * - Tracks plane health and destruction state
 * - Handles damage and death sequences
 * - Manages plane position updates
 */
export const usePlaneState = () => {
  const [planeState, setPlaneState] = useState<PlaneState>({
    health: GAME_CONFIG.PLANE.MAX_HEALTH,
    isAlive: true,
    isDestroyed: false,
    position: { x: 0, y: 0, scale: 0.25 },
  });

  const updatePosition = useCallback((x: number, y: number, scale: number) => {
    setPlaneState(prev => ({
      ...prev,
      position: { x, y, scale },
    }));
  }, []);

  const takeDamage = useCallback(() => {
    setPlaneState(prev => {
      const newHealth = Math.max(0, prev.health - 1);
      const isAlive = newHealth > 0;
      const isDestroyed = newHealth === 0;

      return {
        ...prev,
        health: newHealth,
        isAlive,
        isDestroyed,
      };
    });
  }, []);

  const resetPlane = useCallback(() => {
    setPlaneState({
      health: GAME_CONFIG.PLANE.MAX_HEALTH,
      isAlive: true,
      isDestroyed: false,
      position: { x: 0, y: 0, scale: 0.25 },
    });
  }, []);

  return {
    planeState,
    updatePosition,
    takeDamage,
    resetPlane,
  };
};
