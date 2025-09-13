import { useCallback } from "react";
import { useApplication } from "@pixi/react";

interface ShootingHook {
  handleClick: (event: MouseEvent, createBullet: (startX: number, startY: number, targetX: number, targetY: number) => void, canShoot: boolean, shootBullet: () => boolean) => void;
}

/**
 * Custom hook for handling shooting mechanics
 * - Detects mouse clicks
 * - Calculates bullet trajectory from cannon to target
 * - Integrates with bullet system
 */
export const useShooting = (): ShootingHook => {
  const { app } = useApplication();

  const handleClick = useCallback((event: MouseEvent, createBullet: (startX: number, startY: number, targetX: number, targetY: number) => void, canShoot: boolean, shootBullet: () => boolean) => {
    if (!app || !canShoot) return;

    // Try to consume a bullet
    const bulletConsumed = shootBullet();
    if (!bulletConsumed) return;

    // Get canvas bounds
    const canvas = app.view as HTMLCanvasElement;
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
