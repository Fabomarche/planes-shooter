import { PlaneSprite } from "../entities/plane-sprite";
import { CloudSystem } from "../entities/cloud-system";
import { CrosshairSprite } from "../entities/crosshair-sprite";
import { BulletSystem, useBulletSystem } from "../entities/bullet-system";
import {
  ExplosionSystem,
  useExplosionSystem,
} from "../entities/explosion-system";
import { CollisionDebug } from "../entities/collision-debug";
import { PlaneDeathExplosion } from "../entities/plane-death-explosion";
import { BulletCounter } from "../ui/bullet-counter";
import { useMousePosition } from "../../hooks/use-mouse-position";
import { useShooting } from "../../hooks/use-shooting";
import { usePlaneState } from "../../hooks/use-plane-state";
import { useBulletCounter } from "../../hooks/use-bullet-counter";
import { usePlanesDestroyed } from "../../hooks/use-planes-destroyed";
import { useSound } from "../../hooks/use-sound";
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
  const { planeState, updatePosition, takeDamage, resetPlane } =
    usePlaneState();
  const { bulletsRemaining, canShoot, shootBullet } = useBulletCounter();
  const { planesDestroyed, addPlaneDestroyed } = usePlanesDestroyed();
  const { playShootSound, playExplosion2Sound, playExplosion3Sound } = useSound();
  const [showDeathExplosion, setShowDeathExplosion] = useState(false);

  // Handle plane position updates
  const handlePlanePositionUpdate = (x: number, y: number, scale: number) => {
    updatePosition(x, y, scale);
  };

  // Handle bullet collision with plane
  const handleBulletCollision = (
    _bullet: unknown,
    collisionX: number,
    collisionY: number,
  ) => {
    if (!planeState.isAlive) return; // Don't process collisions if plane is dead

    // Create normal explosion
    createExplosion(
      collisionX,
      collisionY,
      "plane-1", // Associate explosion with plane
      planeState.position.x, // Plane X position at collision
      planeState.position.y, // Plane Y position at collision
    );

    // Take damage
    takeDamage();

    // Check if plane is destroyed
    if (planeState.health === 1) {
      // This will be 0 after takeDamage
      setShowDeathExplosion(true);
      addPlaneDestroyed(); // Increment destroyed planes counter
    }
  };

  // Handle death explosion completion
  const handleDeathExplosionComplete = () => {
    setShowDeathExplosion(false);
    resetPlane(); // Reset plane for next cycle
    // Note: Bullet counter is global and doesn't reset with each plane
  };

  // Set up click event listener
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const clickHandler = (event: MouseEvent) => {
      handleClick(event, createBullet, canShoot, shootBullet, playShootSound);
    };

    canvas.addEventListener("click", clickHandler);

    return () => {
      canvas.removeEventListener("click", clickHandler);
    };
  }, [handleClick, createBullet, canShoot, shootBullet, playShootSound]);

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

      {/* Plane - only show if alive */}
      {planeState.isAlive && (
        <PlaneSprite onPositionUpdate={handlePlanePositionUpdate} />
      )}

      {/* Debug collision box for plane */}
      {GAME_CONFIG.DEBUG.SHOW_COLLISION_BOXES && planeState.isAlive && (
        <CollisionDebug
          x={planeState.position.x}
          y={planeState.position.y}
          scale={planeState.position.scale}
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
        planeData={planeState.position}
      />

      {/* Explosion system - renders normal explosion effects */}
      <ExplosionSystem
        explosions={explosions}
        onRemoveExplosion={removeExplosion}
        planeData={planeState.position}
        playExplosion2Sound={playExplosion2Sound}
      />

      {/* Death explosion sequence - renders on top of normal explosions */}
      {showDeathExplosion && (
        <PlaneDeathExplosion
          x={planeState.position.x}
          y={planeState.position.y}
          onComplete={handleDeathExplosionComplete}
          playExplosion3Sound={playExplosion3Sound}
        />
      )}

      {/* Anti-aircraft cannon crosshair - renders on top of everything */}
      <CrosshairSprite x={mousePosition.x} y={mousePosition.y} scale={1.2} />

      {/* Bullet counter UI - renders on top of all game elements */}
      <BulletCounter 
        bulletsRemaining={bulletsRemaining} 
        canShoot={canShoot} 
        planesDestroyed={planesDestroyed}
      />
    </>
  );
};
