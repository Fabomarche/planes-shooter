import React, { useCallback, useEffect } from "react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useAudioSettings } from "../../contexts/audio-context";

interface ConfigModalProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  x,
  y,
  width,
  height,
  onClose,
}) => {
  const { audioSettings, toggleMusicMute, toggleFxMute } = useAudioSettings();

  const drawModal = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Modal background - dark military style
      g.beginFill(0x000000, 0.9);
      g.drawRoundedRect(0, 0, width, height, 8);
      g.endFill();

      // Border - military green
      g.lineStyle(3, 0x00ff00);
      g.drawRoundedRect(0, 0, width, height, 8);

      // Inner border for depth
      g.lineStyle(1, 0x004400);
      g.drawRoundedRect(2, 2, width - 4, height - 4, 6);
    },
    [width, height],
  );

  const drawToggleButton = useCallback((g: PixiGraphics, isActive: boolean) => {
    g.clear();

    // Toggle background - always dark
    g.beginFill(0x333333);
    g.drawRoundedRect(0, 0, 60, 30, 15);
    g.endFill();

    // Toggle border - green when active, red when inactive
    g.lineStyle(2, isActive ? 0x00aa00 : 0xaa0000);
    g.drawRoundedRect(0, 0, 60, 30, 15);

    // Toggle circle - military colors
    g.beginFill(0x000000);
    g.drawCircle(isActive ? 45 : 15, 15, 12);
    g.endFill();

    // Circle border
    g.lineStyle(1, isActive ? 0x00ff00 : 0xff0000);
    g.drawCircle(isActive ? 45 : 15, 15, 12);
  }, []);

  // Handle click events using DOM events
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if click is within modal bounds
      if (
        clickX >= x &&
        clickX <= x + width &&
        clickY >= y &&
        clickY <= y + height
      ) {
        const localX = clickX - x;
        const localY = clickY - y;

        // Check if click is on close button (X area) - larger click area
        if (
          localX >= width - 35 &&
          localX <= width - 15 &&
          localY >= 15 &&
          localY <= 35
        ) {
          onClose();
          return;
        }

        // Check if click is on music toggle button
        if (
          localX >= width - 70 &&
          localX <= width - 10 &&
          localY >= 60 &&
          localY <= 90
        ) {
          toggleMusicMute();
          return;
        }

        // Check if click is on FX toggle button
        if (
          localX >= width - 70 &&
          localX <= width - 10 &&
          localY >= 110 &&
          localY <= 140
        ) {
          toggleFxMute();
          return;
        }
      }
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [x, y, width, height, onClose, toggleMusicMute, toggleFxMute]);

  return (
    <pixiContainer x={x} y={y}>
      {/* Modal background */}
      <pixiGraphics draw={drawModal} />

      {/* Close button */}
      <pixiText
        text="X"
        x={width - 25}
        y={15}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 20,
          fill: 0xffffff,
          fontWeight: "bold",
        }}
      />

      {/* Title */}
      <pixiText
        text="SYSTEM CONFIG"
        x={20}
        y={20}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 16,
          fill: 0x00ff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />

      {/* Music setting */}
      <pixiText
        text="MUSIC CHANNEL:"
        x={20}
        y={70}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 12,
          fill: 0x00ff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />
      <pixiContainer x={width - 70} y={60}>
        <pixiGraphics
          draw={(g) => drawToggleButton(g, !audioSettings.isMusicMuted)}
        />
      </pixiContainer>

      {/* FX setting */}
      <pixiText
        text="FX CHANNEL:"
        x={20}
        y={120}
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 12,
          fill: 0x00ff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 1 },
        }}
      />
      <pixiContainer x={width - 70} y={110}>
        <pixiGraphics
          draw={(g) => drawToggleButton(g, !audioSettings.isFxMuted)}
        />
      </pixiContainer>
    </pixiContainer>
  );
};
