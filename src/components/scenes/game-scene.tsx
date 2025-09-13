import { PlaneSprite } from "../entities/plane-sprite";
import { CloudSystem } from "../entities/cloud-system";
import { CrosshairSprite } from "../entities/crosshair-sprite";
import { BulletSystem, useBulletSystem } from "../entities/bullet-system";
import {
  ExplosionSystem,
  useExplosionSystem,
} from "../entities/explosion-system";
import { CollisionDebug } from "../entities/collision-debug";
import { useMousePosition } from "../../hooks/use-mouse-position";
import { useShooting } from "../../hooks/use-shooting";
import { useEffect, useState } from "react";
import { GAME_CONFIG } from "../../constants/game-config";

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
  const { bullets, createBullet, removeBullet } = useBulletSystem();
  const { explosions, createExplosion, removeExplosion } = useExplosionSystem();
  const { handleClick } = useShooting();
  const [planeData, setPlaneData] = useState({ x: 0, y: 0, scale: 0.25 });

  // Handle plane position updates
  const handlePlanePositionUpdate = (x: number, y: number, scale: number) => {
    setPlaneData({ x, y, scale });
  };

  // Handle bullet collision with plane
  const handleBulletCollision = (
    _bullet: unknown,
    collisionX: number,
    collisionY: number,
  ) => {
    createExplosion(
      collisionX,
      collisionY,
      "plane-1", // Associate explosion with plane
      planeData.x, // Plane X position at collision
      planeData.y, // Plane Y position at collision
    );
  };

  // Set up click event listener
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const clickHandler = (event: MouseEvent) => {
      handleClick(event, createBullet);
    };

    canvas.addEventListener("click", clickHandler);

    return () => {
      canvas.removeEventListener("click", clickHandler);
    };
  }, [handleClick, createBullet]);

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

      <PlaneSprite onPositionUpdate={handlePlanePositionUpdate} />

      {/* Debug collision box for plane */}
      {GAME_CONFIG.DEBUG.SHOW_COLLISION_BOXES && (
        <CollisionDebug
          x={planeData.x}
          y={planeData.y}
          scale={planeData.scale}
          width={GAME_CONFIG.PLANE.COLLISION_WIDTH}
          height={GAME_CONFIG.PLANE.COLLISION_HEIGHT}
        />
      )}

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

      {/* Bullet system - renders projectiles with physics */}
      <BulletSystem
        bullets={bullets}
        onRemoveBullet={removeBullet}
        onBulletCollision={handleBulletCollision}
        planeData={planeData}
      />

      {/* Explosion system - renders explosion effects */}
      <ExplosionSystem
        explosions={explosions}
        onRemoveExplosion={removeExplosion}
        planeData={planeData}
      />

      {/* Anti-aircraft cannon crosshair - renders on top of everything */}
      <CrosshairSprite x={mousePosition.x} y={mousePosition.y} scale={1.2} />
    </>
  );
};
