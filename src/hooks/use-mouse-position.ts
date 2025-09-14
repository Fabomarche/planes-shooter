import { useState, useEffect } from "react";
import { useApplication } from "@pixi/react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Custom hook for tracking mouse position within the Pixi.js application
 * - Returns current mouse coordinates relative to the application canvas
 * - Uses both Pixi.js interaction system and DOM events as fallback
 * - Automatically updates when mouse moves
 * - Optimized for performance with proper cleanup
 */
export const useMousePosition = (): MousePosition => {
  const { app } = useApplication();
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    if (!app) return;

    const handlePointerMove = (event: any) => {
      // Get global position from Pixi.js interaction system
      const globalPosition = event.data.global;
      setMousePosition({
        x: globalPosition.x,
        y: globalPosition.y,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Fallback to DOM events if Pixi.js events don't work
      const canvas = app.canvas as HTMLCanvasElement;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setMousePosition({ x, y });
    };

    // Try Pixi.js interaction system first
    if (app.stage) {
      app.stage.interactive = true;
      app.stage.on('pointermove', handlePointerMove);
    }

    // Add DOM event listener as fallback
    const canvas = app.canvas as HTMLCanvasElement;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup function
    return () => {
      if (app.stage) {
        app.stage.off('pointermove', handlePointerMove);
      }
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [app]);

  return mousePosition;
};
