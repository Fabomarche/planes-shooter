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

/**
 * CloudSystem component for managing multiple clouds
 * - Generates random cloud positions and properties
 * - Optimized for performance with useMemo
 */
export const CloudSystem = ({ cloudCount = 8 }: { cloudCount?: number }) => {
  const { app } = useApplication();

  const clouds = useMemo(() => {
    const cloudData: CloudData[] = [];
    
    for (let i = 0; i < cloudCount; i++) {
      cloudData.push({
        id: `cloud-${i}`,
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height * 1, // % of screen
        scale: 0.2 + Math.random() * 0.3, // Scale between 0.2 and 0.5
        speed: 0.2 + Math.random() * 0.8, // Speed between 0.2 and 1.0
        direction: Math.random() > 0.5 ? 'left' : 'right',
      });
    }
    
    return cloudData;
  }, [cloudCount, app.screen.width, app.screen.height]);

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
