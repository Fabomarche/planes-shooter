import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AudioSettings {
  isMusicMuted: boolean;
  isFxMuted: boolean;
  isAudioActivated: boolean;
}

interface AudioContextType {
  audioSettings: AudioSettings;
  toggleMusicMute: () => void;
  toggleFxMute: () => void;
  setMusicMuted: (muted: boolean) => void;
  setFxMuted: (muted: boolean) => void;
  activateAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    isMusicMuted: false,
    isFxMuted: false,
    isAudioActivated: false, // Audio needs user interaction to activate
  });

  const toggleMusicMute = useCallback(() => {
    setAudioSettings(prev => ({
      ...prev,
      isMusicMuted: !prev.isMusicMuted,
    }));
  }, []);

  const toggleFxMute = useCallback(() => {
    setAudioSettings(prev => ({
      ...prev,
      isFxMuted: !prev.isFxMuted,
    }));
  }, []);

  const setMusicMuted = useCallback((muted: boolean) => {
    setAudioSettings(prev => ({
      ...prev,
      isMusicMuted: muted,
    }));
  }, []);

  const setFxMuted = useCallback((muted: boolean) => {
    setAudioSettings(prev => ({
      ...prev,
      isFxMuted: muted,
    }));
  }, []);

  const activateAudio = useCallback(() => {
    setAudioSettings(prev => ({
      ...prev,
      isAudioActivated: true,
    }));
  }, []);

  const value: AudioContextType = {
    audioSettings,
    toggleMusicMute,
    toggleFxMute,
    setMusicMuted,
    setFxMuted,
    activateAudio,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioSettings = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioSettings must be used within an AudioProvider');
  }
  return context;
};
