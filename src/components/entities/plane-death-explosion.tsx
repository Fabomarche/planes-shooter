import { useEffect, useState } from "react";
import { useTick } from "@pixi/react";
import { useAsset } from "../../hooks/use-asset";
import { GAME_CONFIG } from "../../constants/game-config";

interface PlaneDeathExplosionProps {
  x: number;
  y: number;
  onComplete: () => void;
  playExplosion3Sound?: () => void;
}

/**
 * PlaneDeathExplosion component for showing the final death explosion
 * - Shows explosion-2 first with scale 0.5
 * - After 100ms, shows explosion-3 with scale 1.0 and fade-in
 * - Explosion-3 fades out after 1.5 seconds
 * - Calls onComplete when finished
 */
export const PlaneDeathExplosion = ({
  x,
  y,
  onComplete,
  playExplosion3Sound,
}: PlaneDeathExplosionProps) => {
  const { texture: explosion2Texture, isLoading: loading2 } =
    useAsset("EXPLOSION_2");
  const { texture: explosion3Texture, isLoading: loading3 } =
    useAsset("EXPLOSION_3");
  const [showExplosion2, setShowExplosion2] = useState(true);
  const [showExplosion3, setShowExplosion3] = useState(false);
  const [explosion3Alpha, setExplosion3Alpha] = useState(0);
  const [explosion3StartTime, setExplosion3StartTime] = useState<number | null>(
    null,
  );

  useEffect(() => {
    // Show explosion-2 immediately, then explosion-3 after short delay
    const timer = setTimeout(() => {
      setShowExplosion2(false);
      setShowExplosion3(true);
      setExplosion3StartTime(Date.now());
      
      // Play explosion-3 sound when explosion-3 starts
      if (playExplosion3Sound) {
        playExplosion3Sound();
      }
    }, 100); // Very short delay

    return () => clearTimeout(timer);
  }, [playExplosion3Sound]);

  useTick(() => {
    // Handle explosion 3 fade-in and fade-out animation
    if (showExplosion3 && explosion3StartTime) {
      const elapsedTime = Date.now() - explosion3StartTime;
      const fadeInDuration = 100; // 0.1 seconds fade-in
      const fadeOutDuration = 1500; // 1.5 seconds fade-out
      const totalDuration = fadeInDuration + fadeOutDuration;

      if (elapsedTime >= totalDuration) {
        // Animation complete, hide explosion 3
        setShowExplosion3(false);
        onComplete();
      } else if (elapsedTime <= fadeInDuration) {
        // Fade-in phase
        const alpha = elapsedTime / fadeInDuration;
        setExplosion3Alpha(alpha);
      } else {
        // Fade-out phase
        const fadeOutElapsed = elapsedTime - fadeInDuration;
        const alpha = Math.max(0, 1 - fadeOutElapsed / fadeOutDuration);
        setExplosion3Alpha(alpha);
      }
    }
  });

  // Show loading state
  if (loading2 || loading3) {
    return null;
  }

  return (
    <>
      {/* Explosion 2 - Damage explosion */}
      {showExplosion2 && explosion2Texture && (
        <pixiSprite
          texture={explosion2Texture}
          anchor={0.5}
          x={x}
          y={y}
          scale={GAME_CONFIG.PLANE.DAMAGE_EXPLOSION_SCALE}
        />
      )}

      {/* Explosion 3 - Death explosion with fade-in and fade-out */}
      {showExplosion3 && explosion3Texture && (
        <pixiSprite
          texture={explosion3Texture}
          anchor={0.5}
          x={x}
          y={y}
          scale={GAME_CONFIG.PLANE.DEATH_EXPLOSION_SCALE}
          alpha={explosion3Alpha}
        />
      )}
    </>
  );
};