import { useCallback, useRef } from "react";
import { useAudioSettings } from '../contexts/audio-context';

interface SoundHook {
  playShootSound: () => void;
  playEmptyBulletsSound: () => void;
  playExplosion2Sound: () => void;
  playExplosion3Sound: () => void;
  setVolume: (volume: number) => void;
}

/**
 * Custom hook for managing game sounds
 * - Handles audio loading and playback
 * - Manages volume control
 * - Optimized for performance with audio caching
 */
export const useSound = (): SoundHook => {
  const { audioSettings } = useAudioSettings();
  const shootSoundRef = useRef<HTMLAudioElement | null>(null);
  const emptyBulletsSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosion2SoundRef = useRef<HTMLAudioElement | null>(null);
  const explosion3SoundRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(0.5); // Default volume 50%

  // Initialize sounds
  const initializeSounds = useCallback(() => {
    if (!shootSoundRef.current) {
      shootSoundRef.current = new Audio('/assets/shot.mp3');
      shootSoundRef.current.preload = 'auto';
      shootSoundRef.current.volume = volumeRef.current;
    }

    if (!emptyBulletsSoundRef.current) {
      emptyBulletsSoundRef.current = new Audio('/assets/empty-bullets.mp3');
      emptyBulletsSoundRef.current.preload = 'auto';
      emptyBulletsSoundRef.current.volume = volumeRef.current;
    }
    
    if (!explosion2SoundRef.current) {
      explosion2SoundRef.current = new Audio('/assets/explosion-2.mp3');
      explosion2SoundRef.current.preload = 'auto';
      explosion2SoundRef.current.volume = volumeRef.current;
    }

    if (!explosion3SoundRef.current) {
      explosion3SoundRef.current = new Audio('/assets/explosion-3.mp3');
      explosion3SoundRef.current.preload = 'auto';
      explosion3SoundRef.current.volume = volumeRef.current;
    }
  }, []);

  // Play shoot sound
  const playShootSound = useCallback(() => {
    if (audioSettings.isFxMuted) return;
    
    initializeSounds();
    
    if (shootSoundRef.current) {
      // Start audio from 1 second mark for better sound effect
      shootSoundRef.current.currentTime = 1.0;
      shootSoundRef.current.play().catch((error) => {
        console.warn('Could not play shoot sound:', error);
      });
    }
  }, [initializeSounds, audioSettings.isFxMuted]);

  // Play empty bullets sound
  const playEmptyBulletsSound = useCallback(() => {
    if (audioSettings.isFxMuted) return;
    
    initializeSounds();
    
    if (emptyBulletsSoundRef.current) {
      emptyBulletsSoundRef.current.currentTime = 0;
      emptyBulletsSoundRef.current.play().catch((error) => {
        console.warn('Could not play empty bullets sound:', error);
      });
    }
  }, [initializeSounds, audioSettings.isFxMuted]);

  // Play explosion-2 sound
  const playExplosion2Sound = useCallback(() => {
    if (audioSettings.isFxMuted) return;
    
    initializeSounds();
    
    if (explosion2SoundRef.current) {
      explosion2SoundRef.current.currentTime = 0;
      explosion2SoundRef.current.play().catch((error) => {
        console.warn('Could not play explosion-2 sound:', error);
      });
    }
  }, [initializeSounds, audioSettings.isFxMuted]);

  // Play explosion-3 sound
  const playExplosion3Sound = useCallback(() => {
    if (audioSettings.isFxMuted) return;
    
    initializeSounds();
    
    if (explosion3SoundRef.current) {
      explosion3SoundRef.current.currentTime = 0;
      explosion3SoundRef.current.play().catch((error) => {
        console.warn('Could not play explosion-3 sound:', error);
      });
    }
  }, [initializeSounds, audioSettings.isFxMuted]);

  // Set volume for all sounds
  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    
    if (shootSoundRef.current) {
      shootSoundRef.current.volume = volumeRef.current;
    }
    if (emptyBulletsSoundRef.current) {
      emptyBulletsSoundRef.current.volume = volumeRef.current;
    }
    if (explosion2SoundRef.current) {
      explosion2SoundRef.current.volume = volumeRef.current;
    }
    if (explosion3SoundRef.current) {
      explosion3SoundRef.current.volume = volumeRef.current;
    }
  }, []);

  return {
    playShootSound,
    playEmptyBulletsSound,
    playExplosion2Sound,
    playExplosion3Sound,
    setVolume,
  };
};
