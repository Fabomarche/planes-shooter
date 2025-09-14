import { useState, useCallback, useEffect } from "react";

interface GameOverHook {
  isGameOver: boolean;
  showGameOverModal: () => void;
  hideGameOverModal: () => void;
  resetGame: () => void;
}

/**
 * Custom hook for managing game over state
 * - Tracks when game over condition is met (no bullets remaining)
 * - Provides functions to show/hide game over modal
 * - Handles complete game reset functionality
 */
export const useGameOver = (
  bulletsRemaining: number,
  resetBullets: () => void,
  resetPlanesDestroyed: () => void,
  resetPlane: () => void,
  clearAllBullets: () => void,
  clearAllExplosions: () => void
): GameOverHook => {
  const [isGameOver, setIsGameOver] = useState(false);

  // Check for game over condition when bullets run out
  useEffect(() => {
    if (bulletsRemaining === 0 && !isGameOver) {
      setIsGameOver(true);
    }
  }, [bulletsRemaining, isGameOver]);

  const showGameOverModal = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const hideGameOverModal = useCallback(() => {
    setIsGameOver(false);
  }, []);

  const resetGame = useCallback(() => {
    // Reset all game systems
    resetBullets();
    resetPlanesDestroyed();
    resetPlane();
    clearAllBullets();
    clearAllExplosions();
    setIsGameOver(false);
  }, [resetBullets, resetPlanesDestroyed, resetPlane, clearAllBullets, clearAllExplosions]);

  return {
    isGameOver,
    showGameOverModal,
    hideGameOverModal,
    resetGame,
  };
};
