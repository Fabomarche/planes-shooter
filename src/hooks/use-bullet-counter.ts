import { useState, useCallback } from "react";
import { GAME_CONFIG } from "../constants/game-config";

interface BulletCounterHook {
  bulletsRemaining: number;
  canShoot: boolean;
  shootBullet: () => boolean;
  resetBullets: () => void;
}

/**
 * Custom hook for managing bullet counter
 * - Tracks remaining bullets
 * - Prevents shooting when out of ammo
 * - Provides reset functionality
 */
export const useBulletCounter = (): BulletCounterHook => {
  const [bulletsRemaining, setBulletsRemaining] = useState<number>(GAME_CONFIG.BULLET.INITIAL_AMMO);

  const canShoot = bulletsRemaining > 0;

  const shootBullet = useCallback((): boolean => {
    if (!canShoot) {
      return false;
    }

    setBulletsRemaining(prev => Math.max(0, prev - 1));
    return true;
  }, [canShoot]);

  const resetBullets = useCallback(() => {
    setBulletsRemaining(GAME_CONFIG.BULLET.INITIAL_AMMO);
  }, []);

  return {
    bulletsRemaining,
    canShoot,
    shootBullet,
    resetBullets,
  };
};
