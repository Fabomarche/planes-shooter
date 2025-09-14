import React, { useCallback } from "react";
import { Graphics as PixiGraphics } from "pixi.js";

interface AudioActivationPromptProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onActivate: () => void;
}

export const AudioActivationPrompt: React.FC<AudioActivationPromptProps> = ({
  x,
  y,
  width,
  height,
  onActivate,
}) => {
  const drawPrompt = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Semi-transparent background
      g.beginFill(0x000000, 0.8);
      g.drawRoundedRect(0, 0, width, height, 8);
      g.endFill();

      // Border
      g.lineStyle(3, 0x00ff00);
      g.drawRoundedRect(0, 0, width, height, 8);

      // Inner border
      g.lineStyle(1, 0x004400);
      g.drawRoundedRect(2, 2, width - 4, height - 4, 6);
    },
    [width, height],
  );

  // Handle click events
  const handleClick = useCallback(() => {
    onActivate();
  }, [onActivate]);

  return (
    <pixiContainer x={x} y={y} interactive={true} onPointerDown={handleClick}>
      {/* Background */}
      <pixiGraphics draw={drawPrompt} />

      {/* Title */}
      <pixiText
        text="AUDIO ACTIVATION REQUIRED"
        x={width / 2}
        y={30}
        anchor={0.5}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 16,
          fill: 0x00ff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />

      {/* Message */}
      <pixiText
        text="Click anywhere to enable audio"
        x={width / 2}
        y={70}
        anchor={0.5}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 14,
          fill: 0xffffff,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />

      {/* Click instruction */}
      <pixiText
        text="CLICK TO CONTINUE"
        x={width / 2}
        y={110}
        anchor={0.5}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 12,
          fill: 0xffff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />
    </pixiContainer>
  );
};
