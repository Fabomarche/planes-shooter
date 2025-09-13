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
    EXPLOSION: "/assets/explotion-1.png",
    EXPLOSION_2: "/assets/explotion-2.png",
    EXPLOSION_3: "/assets/explotion-3.png",
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

  // Explosion settings
  EXPLOSION: {
    DURATION: 1000, // milliseconds
    SCALE: 0.1,
    MAX_EXPLOSIONS: 10,
  },

  // Plane settings
  PLANE: {
    COLLISION_WIDTH: 800, // Width of collision box
    COLLISION_HEIGHT: 150, // Height of collision box
    SCALE: 0.25,
    MAX_HEALTH: 4, // Number of hits before destruction
    DAMAGE_EXPLOSION_SCALE: 0.5, // Scale for damage explosion (explosion-2)
    DEATH_EXPLOSION_SCALE: 1.0, // Scale for death explosion (explosion-3)
    DEATH_EXPLOSION_DELAY: 1000, // Delay before death explosion (ms)
  },

  // Performance settings
  USE_WEBGPU: true,
  FALLBACK_TO_WEBGL: true,

  // Debug settings
  DEBUG: {
    SHOW_COLLISION_BOXES: false, // Set to false to hide collision boxes
    COLLISION_BOX_COLOR: 0xff0000, // Red color for collision boxes
    COLLISION_BOX_ALPHA: 0.3, // Semi-transparent
  },
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
