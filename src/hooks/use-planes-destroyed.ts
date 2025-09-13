import { useState, useCallback } from "react";

interface PlanesDestroyedHook {
  planesDestroyed: number;
  addPlaneDestroyed: () => void;
  resetPlanesDestroyed: () => void;
}

/**
 * Custom hook for managing destroyed planes counter
 * - Tracks number of planes destroyed
 * - Provides increment and reset functionality
 */
export const usePlanesDestroyed = (): PlanesDestroyedHook => {
  const [planesDestroyed, setPlanesDestroyed] = useState<number>(0);

  const addPlaneDestroyed = useCallback(() => {
    setPlanesDestroyed(prev => prev + 1);
  }, []);

  const resetPlanesDestroyed = useCallback(() => {
    setPlanesDestroyed(0);
  }, []);

  return {
    planesDestroyed,
    addPlaneDestroyed,
    resetPlanesDestroyed,
  };
};
