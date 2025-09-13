import { useRef, useEffect } from "react";
import { useApplication } from "@pixi/react";
import { Text, Graphics, Container, Sprite } from "pixi.js";
import { useAsset } from "../../hooks/use-asset";

interface BulletCounterProps {
  bulletsRemaining: number;
  canShoot: boolean;
  planesDestroyed: number;
}

/**
 * UI component that displays the remaining bullet count and destroyed planes counter
 * Shows bullets in red when out of ammo, green when ammo is available
 * Shows destroyed planes count with plane and explosion sprites
 * Positioned in bottom-left corner with dark background
 */
export const BulletCounter = ({
  bulletsRemaining,
  canShoot,
  planesDestroyed,
}: BulletCounterProps) => {
  const { app } = useApplication();
  const containerRef = useRef<Container | null>(null);
  const backgroundRef = useRef<Graphics | null>(null);
  const bulletsTextRef = useRef<Text | null>(null);
  const planesTextRef = useRef<Text | null>(null);
  const planeSpriteRef = useRef<Sprite | null>(null);
  const explosionSpriteRef = useRef<Sprite | null>(null);

  // Load assets for sprites
  const { texture: planeTexture } = useAsset("PLANE");
  const { texture: explosionTexture } = useAsset("EXPLOSION_2");

  useEffect(() => {
    if (!app || !planeTexture || !explosionTexture) return;

    // Create container for the UI element
    const container = new Container();
    containerRef.current = container;

    // Create background rectangle (wider to accommodate both counters)
    const background = new Graphics();
    background.beginFill(0x000000, 0.7); // Dark background with transparency
    background.drawRoundedRect(0, 0, 350, 50, 8); // Wider rounded rectangle
    background.endFill();
    backgroundRef.current = background;
    container.addChild(background);

    // Create bullets text
    const bulletsText = new Text(`BULLETS: ${bulletsRemaining}`, {
      fontFamily: "Courier New, monospace",
      fontSize: 18,
      fontWeight: "bold",
      fill: canShoot ? "#00ff00" : "#ff0000",
      stroke: { color: "#000000", width: 1 },
    });
    bulletsText.x = 15;
    bulletsText.y = 15;
    bulletsTextRef.current = bulletsText;
    container.addChild(bulletsText);

    // Create plane sprite (small scale)
    const planeSprite = new Sprite(planeTexture);
    planeSprite.scale.set(0.125); // Small scale for UI
    planeSprite.x = 140;
    planeSprite.y = -45;
    planeSpriteRef.current = planeSprite;
    container.addChild(planeSprite);

    // Create explosion sprite (small scale, positioned above plane)
    const explosionSprite = new Sprite(explosionTexture);
    explosionSprite.scale.set(0.06); // Very small scale for UI
    explosionSprite.x = 170;
    explosionSprite.y = -10;
    explosionSpriteRef.current = explosionSprite;
    container.addChild(explosionSprite);

    // Create planes destroyed text
    const planesText = new Text(`${planesDestroyed}`, {
      fontFamily: "Courier New, monospace",
      fontSize: 22,
      fontWeight: "bold",
      fill: "#ffff00", // Yellow color for planes count
      stroke: { color: "#000000", width: 1 },
    });
    planesText.x = 240;
    planesText.y = 15;
    planesTextRef.current = planesText;
    container.addChild(planesText);

    // Position container in bottom-left corner
    container.x = 20;
    container.y = app.screen.height - 80;

    // Add to stage
    app.stage.addChild(container);

    // Cleanup function
    return () => {
      if (containerRef.current && app.stage) {
        app.stage.removeChild(containerRef.current);
      }
    };
  }, [
    app,
    bulletsRemaining,
    canShoot,
    planesDestroyed,
    planeTexture,
    explosionTexture,
  ]);

  // Update text when props change
  useEffect(() => {
    if (bulletsTextRef.current) {
      bulletsTextRef.current.text = `BULLETS: ${bulletsRemaining}`;
      bulletsTextRef.current.style.fill = canShoot ? "#00ff00" : "#ff0000";
    }
    if (planesTextRef.current) {
      planesTextRef.current.text = `${planesDestroyed}`;
    }
  }, [bulletsRemaining, canShoot, planesDestroyed]);

  // Update position when screen size changes
  useEffect(() => {
    if (containerRef.current && app) {
      containerRef.current.y = app.screen.height - 80;
    }
  }, [app, app?.screen.height]);

  return null; // This component manages Pixi objects directly
};
