import { useRef, useState, useEffect } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Sprite } from "pixi.js";
import { useAsset } from "../../hooks/use-asset";

/**
 * PlaneSprite component following React + Pixi.js best practices
 * - Uses custom hook for asset loading
 * - Implements proper cleanup
 * - Follows naming conventions from pixi.mdc rules
 */
interface PlaneSpriteProps {
  onPositionUpdate?: (x: number, y: number, scale: number) => void;
}

export const PlaneSprite = ({ onPositionUpdate }: PlaneSpriteProps) => {
  const { app } = useApplication();
  const spriteRef = useRef<Sprite>(null);
  const [animationStartTime, setAnimationStartTime] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [endY, setEndY] = useState<number>(0);
  const [currentRotation, setCurrentRotation] = useState<number>(0.5);

  // Use custom hook for asset loading with proper error handling
  const { texture, isLoading, error } = useAsset("PLANE");

  // Reset animation every 4 seconds with random start and end Y positions
  useEffect(() => {
    const generateRandomYs = () => {
      // Generate random Y positions between 20% and 80% of screen height
      const minY = app.screen.height * 0.2;
      const maxY = app.screen.height * 0.8;

      const newStartY = Math.random() * (maxY - minY) + minY;
      const newEndY = Math.random() * (maxY - minY) + minY;

      setStartY(newStartY);
      setEndY(newEndY);

      // Calculate rotation based on direction (0.5 is horizontal baseline)
      const deltaY = newEndY - newStartY;
      const deltaX = app.screen.width + 200; // Total horizontal distance
      const angle = Math.atan2(deltaY, deltaX);
      setCurrentRotation(0.5 + angle); // Add angle to baseline rotation
    };

    const interval = setInterval(() => {
      setAnimationStartTime(Date.now());
      generateRandomYs();
    }, 4000); // Match animation duration

    // Start first animation immediately
    setAnimationStartTime(Date.now());
    generateRandomYs();

    return () => clearInterval(interval);
  }, [app.screen.height, app.screen.width]);

  // Game loop using useTick hook for smooth animations
  useTick(() => {
    if (!spriteRef.current || !texture) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - animationStartTime;
    const animationDuration = 4000; // 4 seconds

    // Calculate progress (0 to 1)
    const progress = Math.min(elapsedTime / animationDuration, 1);

    // Move from left to right
    const startX = -100; // Start off-screen left
    const endX = app.screen.width + 100; // End off-screen right
    const currentX = startX + (endX - startX) * progress;

    // Interpolate Y position from start to end
    const currentY = startY + (endY - startY) * progress;

    spriteRef.current.x = currentX;
    spriteRef.current.y = currentY;
    spriteRef.current.rotation = currentRotation;

    // Notify parent component of current position
    if (onPositionUpdate) {
      onPositionUpdate(currentX, currentY, 0.25); // 0.25 is the scale
    }
  });

  // Show loading state or error
  if (isLoading) {
    return null; // Could render a loading indicator here
  }

  if (error) {
    console.error("Failed to load plane texture:", error);
    return null; // Could render an error state here
  }

  if (!texture) {
    return null;
  }

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      anchor={0.5}
      x={-100}
      y={startY}
      scale={0.25}
      rotation={currentRotation}
    />
  );
};
