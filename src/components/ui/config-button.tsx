import React, { useRef, useEffect } from "react";
import { Container } from "pixi.js";
import { useAsset } from "../../hooks/use-asset";

interface ConfigButtonProps {
  x: number;
  y: number;
  onClick: () => void;
}

export const ConfigButton: React.FC<ConfigButtonProps> = ({
  x,
  y,
  onClick,
}) => {
  const containerRef = useRef<Container | null>(null);
  const { texture, isLoading, error } = useAsset("SETTINGS");

  // Handle click events using DOM events
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if click is within button bounds (assuming 50x50 button)
      if (clickX >= x && clickX <= x + 50 && clickY >= y && clickY <= y + 50) {
        onClick();
      }
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [x, y, onClick]);

  // Show loading state or error
  if (isLoading) {
    return null;
  }

  if (error) {
    console.error("Failed to load settings texture:", error);
    return null;
  }

  if (!texture) {
    return null;
  }

  return (
    <pixiContainer ref={containerRef} x={x} y={y}>
      <pixiSprite texture={texture} anchor={0.5} x={25} y={25} scale={1.5} />
    </pixiContainer>
  );
};
