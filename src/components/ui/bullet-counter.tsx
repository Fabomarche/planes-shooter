import { useRef, useEffect } from "react";
import { useApplication } from "@pixi/react";
import { Text, Graphics, Container } from "pixi.js";

interface BulletCounterProps {
  bulletsRemaining: number;
  canShoot: boolean;
}

/**
 * UI component that displays the remaining bullet count
 * Shows in red when out of ammo, white when ammo is available
 * Positioned in bottom-left corner with dark background
 */
export const BulletCounter = ({
  bulletsRemaining,
  canShoot,
}: BulletCounterProps) => {
  const { app } = useApplication();
  const containerRef = useRef<Container | null>(null);
  const backgroundRef = useRef<Graphics | null>(null);
  const textRef = useRef<Text | null>(null);

  useEffect(() => {
    if (!app) return;

    // Create container for the UI element
    const container = new Container();
    containerRef.current = container;

    // Create background rectangle
    const background = new Graphics();
    background.beginFill(0x000000, 0.7); // Dark background with transparency
    background.drawRoundedRect(0, 0, 180, 50, 8); // Rounded rectangle
    background.endFill();
    backgroundRef.current = background;
    container.addChild(background);

    // Create text object with military-style font
    const textObject = new Text(`BULLETS: ${bulletsRemaining}`, {
      fontFamily: "Courier New, monospace", // Military/terminal style font
      fontSize: 20,
      fontWeight: "bold",
      fill: canShoot ? "#00ff00" : "#ff0000", // Green when can shoot, red when out of ammo
      stroke: { color: "#000000", width: 1 },
    });

    textObject.x = 15;
    textObject.y = 15;
    textRef.current = textObject;
    container.addChild(textObject);

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
  }, [app, bulletsRemaining, canShoot]);

  // Update text when props change
  useEffect(() => {
    if (textRef.current) {
      textRef.current.text = `BULLETS: ${bulletsRemaining}`;
      textRef.current.style.fill = canShoot ? "#00ff00" : "#ff0000";
    }
  }, [bulletsRemaining, canShoot]);

  // Update position when screen size changes
  useEffect(() => {
    if (containerRef.current && app) {
      containerRef.current.y = app.screen.height - 80;
    }
  }, [app, app?.screen.height]);

  return null; // This component manages Pixi objects directly
};
