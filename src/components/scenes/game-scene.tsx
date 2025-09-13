import { PlaneSprite } from "../entities/plane-sprite";
import { CloudSystem } from "../entities/cloud-system";
import { CrosshairSprite } from "../entities/crosshair-sprite";
import { useMousePosition } from "../../hooks/use-mouse-position";

/**
 * Main game scene component
 * Follows pixi.mdc structure guidelines for scene organization
 * - Background clouds render first (behind everything) with smaller scale and slower speed
 * - PlaneSprite renders in the middle
 * - Foreground clouds render last (in front of plane) with normal scale and speed
 * - CrosshairSprite renders on top for anti-aircraft cannon targeting
 */
export const GameScene = () => {
  const mousePosition = useMousePosition();

  return (
    <>
      {/* Background clouds - much smaller and slower for depth effect */}
      <CloudSystem
        cloudCount={25}
        minScale={0.05}
        maxScale={0.15}
        minSpeed={0.05}
        maxSpeed={0.1}
        heightCoverage={1}
        idPrefix="bg-cloud"
      />

      <PlaneSprite />

      {/* Foreground clouds - normal size and speed */}
      <CloudSystem
        cloudCount={8}
        minScale={0.2}
        maxScale={0.6}
        minSpeed={0.2}
        maxSpeed={1.0}
        heightCoverage={1.0}
        idPrefix="fg-cloud"
      />

      {/* Anti-aircraft cannon crosshair - renders on top of everything */}
      <CrosshairSprite
        x={mousePosition.x}
        y={mousePosition.y}
        scale={1.2}
      />
    </>
  );
};
