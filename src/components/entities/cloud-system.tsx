import { useMemo } from "react";
import { useApplication } from "@pixi/react";
import { CloudSprite } from "./cloud-sprite";

interface CloudData {
  id: string;
  x: number;
  y: number;
  scale: number;
  speed: number;
  direction: 'left' | 'right';
}

interface CloudSystemProps {
  cloudCount?: number;
  minScale?: number;
  maxScale?: number;
  minSpeed?: number;
  maxSpeed?: number;
  heightCoverage?: number; // Percentage of screen height to cover
  idPrefix?: string; // Prefix for cloud IDs to avoid conflicts
}

/**
 * CloudSystem component for managing multiple clouds
 * - Generates random cloud positions and properties
 * - Configurable scale, speed, and coverage for different effects
 * - Optimized for performance with useMemo
 */
export const CloudSystem = ({ 
  cloudCount = 8,
  minScale = 0.2,
  maxScale = 0.5,
  minSpeed = 0.2,
  maxSpeed = 1.0,
  heightCoverage = 1.0,
  idPrefix = "cloud"
}: CloudSystemProps) => {
  const { app } = useApplication();

  const clouds = useMemo(() => {
    const cloudData: CloudData[] = [];
    
    for (let i = 0; i < cloudCount; i++) {
      cloudData.push({
        id: `${idPrefix}-${i}`,
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height * heightCoverage,
        scale: minScale + Math.random() * (maxScale - minScale),
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        direction: Math.random() > 0.5 ? 'left' : 'right',
      });
    }
    
    return cloudData;
  }, [cloudCount, minScale, maxScale, minSpeed, maxSpeed, heightCoverage, idPrefix, app.screen.width, app.screen.height]);

  return (
    <>
      {clouds.map((cloud) => (
        <CloudSprite
          key={cloud.id}
          x={cloud.x}
          y={cloud.y}
          scale={cloud.scale}
          speed={cloud.speed}
          direction={cloud.direction}
        />
      ))}
    </>
  );
};
