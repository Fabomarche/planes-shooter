import { useEffect, useState } from "react";
import { useTick } from "@pixi/react";
import { useAsset } from "../../hooks/use-asset";
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

interface ExplosionSpriteProps {
  explosion: ExplosionData;
  onRemove: (id: string) => void;
  planeData?: {
    x: number;
    y: number;
    scale: number;
  };
}

/**
 * ExplosionSprite component for showing explosion effects
 * - Shows explosion at collision point
 * - Auto-removes after duration
 * - Uses proper scale and positioning
 */
export const ExplosionSprite = ({ explosion, onRemove, planeData }: ExplosionSpriteProps) => {
  const { texture, isLoading, error } = useAsset("EXPLOSION");
  const [currentPosition, setCurrentPosition] = useState({ x: explosion.x, y: explosion.y });

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(explosion.id);
    }, GAME_CONFIG.EXPLOSION.DURATION);

    return () => clearTimeout(timer);
  }, [explosion.id, onRemove]);

  // Update position every frame to follow the plane
  useTick(() => {
    if (!planeData) {
      // If no plane data, use original position
      setCurrentPosition({ x: explosion.x, y: explosion.y });
      return;
    }

    // If explosion is associated with a plane, follow the plane's movement
    if (explosion.planeId && explosion.planeXAtCollision !== undefined && explosion.planeYAtCollision !== undefined) {
      // Calculate the offset from the plane position at collision time
      const offsetX = explosion.x - explosion.planeXAtCollision;
      const offsetY = explosion.y - explosion.planeYAtCollision;
      
      // Apply the same offset to the current plane position
      setCurrentPosition({
        x: planeData.x + offsetX,
        y: planeData.y + offsetY,
      });
    } else {
      // Default to original position
      setCurrentPosition({ x: explosion.x, y: explosion.y });
    }
  });

  // Show loading state or error
  if (isLoading || error || !texture) {
    return null;
  }

  return (
    <pixiSprite
      texture={texture}
      anchor={0.5}
      x={currentPosition.x}
      y={currentPosition.y}
      scale={GAME_CONFIG.EXPLOSION.SCALE}
    />
  );
};
