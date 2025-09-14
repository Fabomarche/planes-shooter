import { useState, useCallback, useRef } from "react";

interface RecoilState {
  offsetX: number;
  offsetY: number;
  isRecoiling: boolean;
}

interface CrosshairRecoilHook {
  recoilOffset: { x: number; y: number };
  triggerRecoil: () => void;
}

/**
 * Custom hook for managing crosshair recoil animation
 * - Simulates realistic recoil physics when shooting
 * - Only triggers when bullets are available (bulletsRemaining > 0)
 * - Uses smooth animation with damping for realistic effect
 */
export const useCrosshairRecoil = (bulletsRemaining: number): CrosshairRecoilHook => {
  const [recoilState, setRecoilState] = useState<RecoilState>({
    offsetX: 0,
    offsetY: 0,
    isRecoiling: false,
  });
  
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const triggerRecoil = useCallback(() => {
    // Only trigger recoil if we have bullets available
    if (bulletsRemaining <= 0) {
      return;
    }

    // Don't start new recoil if already recoiling
    if (recoilState.isRecoiling) {
      return;
    }

    // Generate random recoil direction (up and slightly to sides)
    const recoilIntensity = 35 + Math.random() * 10; // 15-25 pixels
    const angle = (Math.PI / 2) + (Math.random() - 0.5) * (Math.PI / 3); // Up with some side variation
    
    const initialOffsetX = Math.cos(angle) * recoilIntensity;
    const initialOffsetY = Math.sin(angle) * recoilIntensity;

    setRecoilState({
      offsetX: initialOffsetX,
      offsetY: initialOffsetY,
      isRecoiling: true,
    });

    // Start recoil animation
    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      const dampingFactor = 0.80; // Controls how quickly recoil returns to center
      
      setRecoilState(prev => {
        const newOffsetX = prev.offsetX * dampingFactor;
        const newOffsetY = prev.offsetY * dampingFactor;
        
        // Stop animation when offset is very small
        if (Math.abs(newOffsetX) < 0.1 && Math.abs(newOffsetY) < 0.1) {
          lastTimeRef.current = 0;
          return {
            offsetX: 0,
            offsetY: 0,
            isRecoiling: false,
          };
        }

        return {
          offsetX: newOffsetX,
          offsetY: newOffsetY,
          isRecoiling: true,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [bulletsRemaining, recoilState.isRecoiling]);

  return {
    recoilOffset: { x: recoilState.offsetX, y: recoilState.offsetY },
    triggerRecoil,
  };
};
