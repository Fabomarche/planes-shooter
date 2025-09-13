import { useState, useEffect } from 'react';
import { useApplication } from '@pixi/react';

interface ScreenDimensions {
  width: number;
  height: number;
}

/**
 * Custom hook for getting current screen dimensions
 * - Returns current screen width and height
 * - Updates when screen size changes
 * - Uses Pixi.js application dimensions
 */
export const useScreenDimensions = (): ScreenDimensions => {
  const { app } = useApplication();
  const [dimensions, setDimensions] = useState<ScreenDimensions>({ width: 0, height: 0 });

  useEffect(() => {
    if (!app) return;

    const updateDimensions = () => {
      setDimensions({
        width: app.screen.width,
        height: app.screen.height,
      });
    };

    // Set initial dimensions
    updateDimensions();

    // Listen for resize events
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [app]);

  return dimensions;
};
