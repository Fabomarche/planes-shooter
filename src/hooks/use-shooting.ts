import { useCallback } from "react";
import { useApplication } from "@pixi/react";

interface ShootingHook {
  handleClick: (event: MouseEvent, createBullet: (startX: number, startY: number, targetX: number, targetY: number) => void, canShoot: boolean, shootBullet: () => boolean, playShootSound: () => void, playEmptyBulletsSound: () => void) => void;
}

/**
 * Custom hook for handling shooting mechanics
 * - Detects mouse clicks
 * - Calculates bullet trajectory from cannon to target
 * - Integrates with bullet system
 * - Plays appropriate sound based on ammo availability
 */
export const useShooting = (): ShootingHook => {
  const { app } = useApplication();

  const handleClick = useCallback((event: MouseEvent, createBullet: (startX: number, startY: number, targetX: number, targetY: number) => void, canShoot: boolean, shootBullet: () => boolean, playShootSound: () => void, playEmptyBulletsSound: () => void) => {
    if (!app) return;

    if (!canShoot) {
      // Play empty bullets sound when trying to shoot without ammo
      playEmptyBulletsSound();
      return;
    }

    // Try to consume a bullet
    const bulletConsumed = shootBullet();
    if (!bulletConsumed) {
      // Play empty bullets sound if bullet consumption failed
      playEmptyBulletsSound();
      return;
    }

    // Play shoot sound for successful shot
    playShootSound();

    // Get canvas bounds
    const canvas = app.canvas as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate click position relative to canvas
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Define cannon position (bottom center of screen)
    const cannonX = app.screen.width / 2;
    const cannonY = app.screen.height - 50; // 50px from bottom

    // Create bullet from cannon to click position
    createBullet(cannonX, cannonY, clickX, clickY);
  }, [app]);

  return {
    handleClick,
  };
};
