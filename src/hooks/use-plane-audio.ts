import { useRef, useCallback, useEffect } from "react";

interface PlaneAudioHook {
  playPlaneSound: () => void;
  stopPlaneSound: () => void;
  fadeOutPlaneSound: () => void;
  resetPlaneSound: () => void;
  setVolume: (volume: number) => void;
}

/**
 * Custom hook for managing plane engine sound
 * - Handles airplane.mp3 playback with looping
 * - Manages audio cutting on explosion
 * - Implements fade out when plane exits screen
 */
export const usePlaneAudio = (): PlaneAudioHook => {
  const planeSoundRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(0.1); // Default volume 10% (reducido)
  const fadeOutIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Initialize plane sound
  const initializePlaneSound = useCallback(() => {
    if (!planeSoundRef.current) {
      planeSoundRef.current = new Audio("/assets/airplain.mp3");
      planeSoundRef.current.preload = "auto";
      planeSoundRef.current.volume = volumeRef.current;
      planeSoundRef.current.loop = true; // Loop the engine sound
    }
  }, []);

  // Play plane engine sound
  const playPlaneSound = useCallback(() => {
    initializePlaneSound();

    if (planeSoundRef.current && !isPlayingRef.current) {
      planeSoundRef.current.currentTime = 0;
      planeSoundRef.current.volume = volumeRef.current;
      planeSoundRef.current.play().catch((error) => {
        console.warn("Could not play plane sound:", error);
      });
      isPlayingRef.current = true;
    }
  }, [initializePlaneSound]);

  // Stop plane sound immediately (for explosions)
  const stopPlaneSound = useCallback(() => {
    if (planeSoundRef.current && isPlayingRef.current) {
      planeSoundRef.current.pause();
      planeSoundRef.current.currentTime = 0;
      isPlayingRef.current = false;

      // Clear any ongoing fade out
      if (fadeOutIntervalRef.current) {
        clearInterval(fadeOutIntervalRef.current);
        fadeOutIntervalRef.current = null;
      }
    }
  }, []);

  // Reset plane sound completely (for new plane cycles)
  const resetPlaneSound = useCallback(() => {
    if (planeSoundRef.current) {
      planeSoundRef.current.pause();
      planeSoundRef.current.currentTime = 0;
      planeSoundRef.current.volume = volumeRef.current; // Reset volume to original
    }
    isPlayingRef.current = false;

    // Clear any ongoing fade out
    if (fadeOutIntervalRef.current) {
      clearInterval(fadeOutIntervalRef.current);
      fadeOutIntervalRef.current = null;
    }
  }, []);

  // Fade out plane sound (for when plane exits screen)
  const fadeOutPlaneSound = useCallback(() => {
    if (!planeSoundRef.current || !isPlayingRef.current) return;

    // Clear any existing fade out
    if (fadeOutIntervalRef.current) {
      clearInterval(fadeOutIntervalRef.current);
    }

    const fadeOutDuration = 2000; // 1 second fade out
    const fadeOutSteps = 20; // Number of volume reduction steps
    const stepDuration = fadeOutDuration / fadeOutSteps;
    const volumeStep = volumeRef.current / fadeOutSteps;

    let currentVolume = volumeRef.current;

    fadeOutIntervalRef.current = setInterval(() => {
      currentVolume -= volumeStep;

      if (planeSoundRef.current) {
        planeSoundRef.current.volume = Math.max(0, currentVolume);
      }

      if (currentVolume <= 0) {
        stopPlaneSound();
      }
    }, stepDuration);
  }, [stopPlaneSound]);

  // Set volume for plane sound
  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(0.2, volume)); // Clamp between 0 and 1

    if (planeSoundRef.current && isPlayingRef.current) {
      planeSoundRef.current.volume = volumeRef.current;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeOutIntervalRef.current) {
        clearInterval(fadeOutIntervalRef.current);
      }
      if (planeSoundRef.current) {
        planeSoundRef.current.pause();
        planeSoundRef.current = null;
      }
    };
  }, []);

  return {
    playPlaneSound,
    stopPlaneSound,
    fadeOutPlaneSound,
    resetPlaneSound,
    setVolume,
  };
};
