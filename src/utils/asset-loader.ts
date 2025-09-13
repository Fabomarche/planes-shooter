import { Assets, Texture } from 'pixi.js';
import { GAME_CONFIG, type AssetKey } from '../constants/game-config';

// Centralized asset loading service
class AssetLoader {
  private loadedAssets = new Map<string, Texture>();
  private loadingPromises = new Map<string, Promise<Texture>>();

  /**
   * Load a single asset by key
   */
  async loadAsset(assetKey: AssetKey): Promise<Texture> {
    const assetPath = GAME_CONFIG.ASSETS[assetKey];
    
    // Return cached asset if already loaded
    if (this.loadedAssets.has(assetPath)) {
      return this.loadedAssets.get(assetPath)!;
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(assetPath)) {
      return this.loadingPromises.get(assetPath)!;
    }

    // Start loading the asset
    const loadingPromise = Assets.load(assetPath).then((texture) => {
      this.loadedAssets.set(assetPath, texture);
      this.loadingPromises.delete(assetPath);
      return texture;
    });

    this.loadingPromises.set(assetPath, loadingPromise);
    return loadingPromise;
  }

  /**
   * Load multiple assets in parallel
   */
  async loadAssets(assetKeys: AssetKey[]): Promise<Texture[]> {
    const promises = assetKeys.map(key => this.loadAsset(key));
    return Promise.all(promises);
  }

  /**
   * Preload all game assets
   */
  async preloadAllAssets(): Promise<void> {
    const allAssetKeys = Object.keys(GAME_CONFIG.ASSETS) as AssetKey[];
    await this.loadAssets(allAssetKeys);
  }

  /**
   * Get a loaded asset (returns undefined if not loaded)
   */
  getAsset(assetKey: AssetKey): Texture | undefined {
    const assetPath = GAME_CONFIG.ASSETS[assetKey];
    return this.loadedAssets.get(assetPath);
  }

  /**
   * Check if an asset is loaded
   */
  isAssetLoaded(assetKey: AssetKey): boolean {
    const assetPath = GAME_CONFIG.ASSETS[assetKey];
    return this.loadedAssets.has(assetPath);
  }

  /**
   * Clear all loaded assets (useful for cleanup)
   */
  clearAssets(): void {
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }
}

// Export singleton instance
export const assetLoader = new AssetLoader();
