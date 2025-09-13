import { useEffect, useState } from 'react';
import { Texture } from 'pixi.js';
import { assetLoader } from '../utils/asset-loader';
import type { AssetKey } from '../constants/game-config';

/**
 * Custom hook for loading Pixi.js assets with React state management
 * Follows React + Pixi.js best practices from pixi.mdc rules
 */
export const useAsset = (assetKey: AssetKey) => {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAsset = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const loadedTexture = await assetLoader.loadAsset(assetKey);
        
        if (isMounted) {
          setTexture(loadedTexture);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load asset'));
          setIsLoading(false);
        }
      }
    };

    loadAsset();

    return () => {
      isMounted = false;
    };
  }, [assetKey]);

  return {
    texture,
    isLoading,
    error,
    isLoaded: texture !== null,
  };
};

/**
 * Hook for loading multiple assets
 */
export const useAssets = (assetKeys: AssetKey[]) => {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const loadedTextures = await assetLoader.loadAssets(assetKeys);
        
        if (isMounted) {
          setTextures(loadedTextures);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load assets'));
          setIsLoading(false);
        }
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, [assetKeys.join(',')]); // Dependency on asset keys

  return {
    textures,
    isLoading,
    error,
    isLoaded: textures.length === assetKeys.length,
  };
};
