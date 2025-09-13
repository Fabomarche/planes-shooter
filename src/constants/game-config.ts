// Game configuration constants
export const GAME_CONFIG = {
  // Rendering settings
  BACKGROUND_COLOR: 0x1099bb,
  TARGET_FPS: 60,

  // Asset paths
  ASSETS: {
    PLANE: "/assets/plane.png",
    BUNNY: "/assets/bunny.png",
    CLOUD: "/assets/cloud.png",
    AIM: "/assets/aim.png",
  },

  // Animation settings
  ROTATION_SPEED: 0.001,

  // Cloud settings
  CLOUD_SPEED: 0.5,
  CLOUD_SCALE: 0.3,

  // Crosshair settings
  CROSSHAIR: {
    SIZE: 60,
    COLOR: 0xff0000,
    THICKNESS: 3,
  },

  // Bullet settings
  BULLET: {
    SPEED: 800, // pixels per second
    SIZE: 4,
    COLOR: 0xffaa00, // orange-yellow
    GRAVITY: 400, // pixels per second squared
    LIFETIME: 3000, // milliseconds
    MAX_BULLETS: 50,
  },

  // Performance settings
  USE_WEBGPU: true,
  FALLBACK_TO_WEBGL: true,
} as const;

// Game state constants
export const GAME_STATES = {
  LOADING: "loading",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "gameOver",
} as const;

// Type definitions for better TypeScript support
export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES];
export type AssetKey = keyof typeof GAME_CONFIG.ASSETS;
