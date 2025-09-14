import { useRef, useCallback, useEffect } from 'react';
import { useAudioSettings } from '../contexts/audio-context';

interface BackgroundMusicHook {
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  resumeBackgroundMusic: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
}

/**
 * Custom hook for managing background music with alternating loop pattern
 * - Plays music-loop-1.mp3 four times, then music-loop-2.mp3 four times
 * - Repeats this cycle indefinitely
 * - Manages seamless transitions between loops
 */
export const useBackgroundMusic = (): BackgroundMusicHook => {
  const { audioSettings } = useAudioSettings();
  const loop1Ref = useRef<HTMLAudioElement | null>(null);
  const loop2Ref = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(0.3); // Default volume 30%
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  
  // Track current state
  const currentLoopRef = useRef<'loop1' | 'loop2'>('loop1');
  const loopCountRef = useRef<number>(0);
  const maxLoopsPerCycle = 4;

  // Initialize audio elements
  const initializeAudio = useCallback(() => {
    if (!loop1Ref.current) {
      loop1Ref.current = new Audio('/assets/music-loop-1.mp3');
      loop1Ref.current.preload = 'auto';
      loop1Ref.current.volume = volumeRef.current;
      loop1Ref.current.loop = false; // We'll handle looping manually
    }
    
    if (!loop2Ref.current) {
      loop2Ref.current = new Audio('/assets/music-loop-2.mp3');
      loop2Ref.current.preload = 'auto';
      loop2Ref.current.volume = volumeRef.current;
      loop2Ref.current.loop = false; // We'll handle looping manually
    }
  }, []);

  // Handle loop completion and cycle management
  const handleLoopEnd = useCallback(() => {
    if (!isPlayingRef.current || isPausedRef.current) return;

    loopCountRef.current++;
    
    // Check if we've completed the required number of loops for current cycle
    if (loopCountRef.current >= maxLoopsPerCycle) {
      // Switch to the other loop and reset counter
      currentLoopRef.current = currentLoopRef.current === 'loop1' ? 'loop2' : 'loop1';
      loopCountRef.current = 0;
    }

    // Play the appropriate loop
    const currentAudio = currentLoopRef.current === 'loop1' ? loop1Ref.current : loop2Ref.current;
    
    if (currentAudio) {
      currentAudio.currentTime = 0;
      currentAudio.play().catch((error) => {
        console.warn(`Could not play ${currentLoopRef.current}:`, error);
      });
    }
  }, []);

  // Set up event listeners for loop completion
  const setupEventListeners = useCallback(() => {
    if (loop1Ref.current && !loop1Ref.current.onended) {
      loop1Ref.current.onended = handleLoopEnd;
    }
    
    if (loop2Ref.current && !loop2Ref.current.onended) {
      loop2Ref.current.onended = handleLoopEnd;
    }
  }, [handleLoopEnd]);

  // Start background music
  const playBackgroundMusic = useCallback(() => {
    if (audioSettings.isMusicMuted) return;
    
    initializeAudio();
    setupEventListeners();
    
    if (!isPlayingRef.current) {
      isPlayingRef.current = true;
      isPausedRef.current = false;
      
      // Reset to beginning of cycle
      currentLoopRef.current = 'loop1';
      loopCountRef.current = 0;
      
      // Start with loop 1
      if (loop1Ref.current) {
        loop1Ref.current.currentTime = 0;
        loop1Ref.current.play().catch((error) => {
          console.warn('Could not play background music loop 1:', error);
        });
      }
    }
  }, [initializeAudio, setupEventListeners, audioSettings.isMusicMuted]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    isPlayingRef.current = false;
    isPausedRef.current = false;
    
    if (loop1Ref.current) {
      loop1Ref.current.pause();
      loop1Ref.current.currentTime = 0;
    }
    
    if (loop2Ref.current) {
      loop2Ref.current.pause();
      loop2Ref.current.currentTime = 0;
    }
    
    // Reset cycle state
    currentLoopRef.current = 'loop1';
    loopCountRef.current = 0;
  }, []);

  // Pause background music
  const pauseBackgroundMusic = useCallback(() => {
    if (isPlayingRef.current && !isPausedRef.current) {
      isPausedRef.current = true;
      
      if (loop1Ref.current) {
        loop1Ref.current.pause();
      }
      
      if (loop2Ref.current) {
        loop2Ref.current.pause();
      }
    }
  }, []);

  // Resume background music
  const resumeBackgroundMusic = useCallback(() => {
    if (audioSettings.isMusicMuted) return;
    
    if (isPlayingRef.current && isPausedRef.current) {
      isPausedRef.current = false;
      
      const currentAudio = currentLoopRef.current === 'loop1' ? loop1Ref.current : loop2Ref.current;
      
      if (currentAudio) {
        currentAudio.play().catch((error) => {
          console.warn(`Could not resume ${currentLoopRef.current}:`, error);
        });
      }
    }
  }, [audioSettings.isMusicMuted]);

  // Set volume for background music
  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    
    if (loop1Ref.current) {
      loop1Ref.current.volume = volumeRef.current;
    }
    
    if (loop2Ref.current) {
      loop2Ref.current.volume = volumeRef.current;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loop1Ref.current) {
        loop1Ref.current.pause();
        loop1Ref.current = null;
      }
      
      if (loop2Ref.current) {
        loop2Ref.current.pause();
        loop2Ref.current = null;
      }
    };
  }, []);

  return {
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    setVolume,
    isPlaying: isPlayingRef.current,
  };
};
